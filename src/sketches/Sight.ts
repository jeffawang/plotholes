import p5 from 'p5';
import { checkbox, slider } from '../components/Controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

const controls = {
  noiseSize: { type: slider, value: 50, min: 0.01, max: 100, step: 0.001 },
  dotCount: { type: slider, value: 4, min: 1, max: 4, step: 1 },
  move: { type: slider, value: 5, min: 1, max: 25, step: 1 },
  debug: { type: checkbox, value: false },
  veryDebug: { type: checkbox, value: false },
};

export const sketcher = new Sketcher({
  title: 'sight',
  width: 600,
  height: 600,
  controls: controls,
  settings: {
    loop: true,
    redrawOnChanges: true,
  },

  sketch: (
    p: p5,
    s: Sketcher<typeof controls>,
    u: Uniforms<typeof controls>
  ) => {
    const colors = {
      bg: p.color(252),
      fg: p.color(0),
      debug: p.color('red'),
    };

    // The setup() function is defaulted by Sketcher,
    //      but it can be overridden in this scope.
    // p.setup = function() { ... }

    class Shape {
      points: p5.Vector[];
      constructor(points: p5.Vector[]) {
        this.points = points;
      }
      add(point: p5.Vector) {
        this.points.push(point);
      }
      draw() {
        p.beginShape();
        for (const pt of this.points) {
          p.vertex(pt.x, pt.y);
        }
        p.endShape(p.CLOSE);
      }
    }

    class LineSegment {
      origin: p5.Vector;
      direction: p5.Vector;
      isRay: boolean;

      constructor(origin: p5.Vector, direction: p5.Vector, isRay: boolean) {
        this.origin = origin;
        this.direction = direction;
        this.isRay = isRay;
      }
      static fromPoints(a: p5.Vector, b: p5.Vector, isRay: boolean) {
        return new LineSegment(a, p5.Vector.sub(b, a), isRay);
      }

      intersectionPoint(other: LineSegment): p5.Vector | null {
        {
          const n1 = p5.Vector.normalize(this.direction);
          const n2 = p5.Vector.normalize(other.direction);
          if (n1.equals(n2)) {
            // parallel
            return null;
          }
        }
        // https://math.stackexchange.com/questions/44770/intersection-of-two-vectors-using-perpedicular-dot-product
        const n1 = p.createVector(this.direction.y, -this.direction.x);
        const n2 = p.createVector(other.direction.y, -other.direction.x);
        const s1 =
          p5.Vector.sub(other.origin, this.origin).dot(n2) /
          this.direction.dot(n2);
        const s2 =
          p5.Vector.sub(this.origin, other.origin).dot(n1) /
          other.direction.dot(n1);

        if (u.veryDebug) {
          const ns = this.direction.copy();
          p.push();
          ns.mult(s1);
          p.strokeWeight(10);
          p.stroke('blue');
          p.point(p5.Vector.add(this.origin, ns));
          p.pop();
        }
        if (u.veryDebug) {
          const ns = other.direction.copy();
          ns.mult(s2);
          p.push();
          p.strokeWeight(10);
          p.stroke('blue');
          p.point(p5.Vector.add(other.origin, ns));
          p.pop();
        }

        if (s1 < 0) {
          // wrong direction
          return null;
        }
        if (s2 < 0 || s2 > 1) {
          // outside the segment
          return null;
        }
        const intersectionPoint = this.direction.copy();
        intersectionPoint.mult(s1).add(this.origin);
        return intersectionPoint;
      }
    }

    p.draw = function () {
      p.background(colors.bg);
      p.stroke(colors.fg);
      p.strokeWeight(1);
      p.fill(colors.bg);

      const center = p.createVector(p.width / 2, p.height / 2);
      const mouse = p.createVector(p.mouseX - center.x, p.mouseY - center.y);

      p.translate(center);

      const shapes: Shape[] = [];

      const n = p.noise(1613, 234623, p.frameCount * 0.01);

      shapes[0] = new Shape([
        p.createVector(10, 100 + n * u.noiseSize),
        p.createVector(60, 100 + n * u.noiseSize),
        p.createVector(60, 200 + n * u.noiseSize),
        p.createVector(10, 200 + n * u.noiseSize),
      ]);
      shapes[0].draw();

      shapes[1] = new Shape([
        p.createVector(50, -10),
        p.createVector(160, 10),
        p.createVector(60, -200),
      ]);
      shapes[1].draw();

      shapes[2] = new Shape([
        p.createVector(-200, -200),
        p.createVector(-250, -150),
        p.createVector(-220, -100),
        p.createVector(-150, -130),
        p.createVector(-160, -180),
      ]);
      shapes[2].draw();

      const hw = p.width / 2;
      const hh = p.height / 2;
      shapes.push(
        new Shape([
          p.createVector(-hw, -hh),
          p.createVector(hw, -hh),
          p.createVector(hw, hh),
          p.createVector(0, hh),
          p.createVector(-hw, hh),
        ])
      );

      const numSamples = 60;
      const radius = 290;
      const circle = new Shape(
        Array.from({ length: numSamples }, (_, k) => {
          const a = (p.TAU / numSamples) * k;
          return p.createVector(p.cos(a), p.sin(a)).mult(radius);
        })
      );
      shapes.push(circle);

      // const ray = new LineSegment(p.createVector(0, 0), mouse, true);\

      const emitters = [
        { rayOrigin: mouse, color: p.color(0, 255, 255, 50) },
        {
          rayOrigin: mouse.copy().rotate(p.TAU / u.dotCount),
          color: p.color(255, 0, 255, 50),
        },
        {
          rayOrigin: mouse.copy().rotate((p.TAU / u.dotCount) * 2),
          color: p.color(255, 255, 0, 50),
        },
        {
          rayOrigin: mouse.copy().rotate((p.TAU / u.dotCount) * 3),
          color: p.color(0, 0, 0, 50),
        },
      ];

      for (const { rayOrigin, color } of emitters.slice(
        0,
        Math.min(u.dotCount, 4)
      )) {
        // const rayOrigin = mouse;
        const intersections: [p5.Vector, number][] = [];
        for (const shape of shapes) {
          for (let i = 0; i < shape.points.length; i++) {
            const pointRay = p5.Vector.sub(shape.points[i], rayOrigin);
            const rays = [
              pointRay.copy().rotate(-0.0001),
              pointRay,
              pointRay.copy().rotate(0.0001),
            ].map((target) => new LineSegment(rayOrigin, target, true));

            for (const ray of rays) {
              let closest: p5.Vector | undefined = undefined;

              for (const shape of shapes) {
                for (let j = 0; j < shape.points.length; j++) {
                  const seg = LineSegment.fromPoints(
                    shape.points[j],
                    shape.points[(j + 1) % shape.points.length],
                    false
                  );
                  const pt = ray.intersectionPoint(seg);
                  if (pt == null) {
                    continue;
                  }

                  if (
                    !closest ||
                    rayOrigin.dist(pt) < rayOrigin.dist(closest)
                  ) {
                    closest = pt;
                  }
                }
              }

              if (closest) {
                intersections.push([
                  closest,
                  p5.Vector.sub(closest, rayOrigin).heading(),
                ]);
              }
            }
          }
        }
        p.push();
        p.stroke(100);
        p.strokeWeight(1);
        p.fill(color);
        p.beginShape();
        intersections
          .sort((a, b) => a[1] - b[1])
          .forEach(([pt, _]) => {
            p.vertex(pt.x, pt.y);

            if (u.debug) {
              p.line(rayOrigin.x, rayOrigin.y, pt.x, pt.y);
              p.push();
              p.strokeWeight(8);
              p.stroke('red');
              p.point(pt);
              p.pop();
            }
          });
        p.endShape(p.CLOSE);
        color.setAlpha(255);
        p.stroke(color);
        p.strokeWeight(10);
        p.point(rayOrigin);
        p.pop();
      }
    };
  },
});
