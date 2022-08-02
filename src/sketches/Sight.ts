import p5 from 'p5';
import { checkbox, slider } from '../components/Controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

const controls = {
  noiseSize: { type: slider, value: 0.02, min: 0.01, max: 0.05, step: 0.001 },
  gridSize: { type: slider, value: 10, min: 8, max: 100, step: 1 },
  move: { type: slider, value: 5, min: 1, max: 25, step: 1 },
  debug: { type: checkbox, value: false },
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

        if (u.debug) {
          const ns = this.direction.copy();
          p.push();
          ns.mult(s1);
          p.strokeWeight(10);
          p.stroke('blue');
          p.point(p5.Vector.add(this.origin, ns));
          p.pop();
        }
        if (u.debug) {
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

      const center = p.createVector(p.width / 2, p.height / 2);
      const mouse = p.createVector(p.mouseX - center.x, p.mouseY - center.y);

      p.translate(center);

      p.push();
      p.strokeWeight(10);
      p.point(0, 0);
      p.pop();

      const shapes: Shape[] = [];
      shapes[0] = new Shape([]);
      shapes[0].add(p.createVector(10, 100));
      shapes[0].add(p.createVector(60, 100));
      shapes[0].add(p.createVector(60, 200));
      shapes[0].add(p.createVector(10, 200));
      shapes[0].draw();

      shapes[1] = new Shape([]);
      shapes[1].add(p.createVector(50, -10));
      shapes[1].add(p.createVector(160, 10));
      shapes[1].add(p.createVector(60, -200));
      shapes[1].draw();

      shapes[2] = new Shape([]);
      shapes[2].add(p.createVector(-200, -200));
      shapes[2].add(p.createVector(-250, -150));
      shapes[2].add(p.createVector(-220, -100));
      shapes[2].add(p.createVector(-150, -130));
      shapes[2].add(p.createVector(-160, -180));
      shapes[2].draw();

      p.stroke('red');
      p.line(0, 0, mouse.x * 1000, mouse.y * 1000);

      const ray = new LineSegment(p.createVector(0, 0), mouse, true);
      for (const shape of shapes) {
        for (let i = 0; i < shape.points.length; i++) {
          const seg = LineSegment.fromPoints(
            shape.points[i],
            shape.points[(i + 1) % shape.points.length],
            false
          );
          const pt = ray.intersectionPoint(seg);
          if (pt == null) {
            continue;
          }
          p.push();
          p.strokeWeight(10);
          p.stroke('red');
          p.point(pt);
          p.pop();
        }
      }
    };
  },
});
