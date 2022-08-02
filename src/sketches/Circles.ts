import p5 from 'p5';
import { group, radio, slider } from '../components/Controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

const controls = {
  circles: {
    type: group,
    value: {
      margin: { type: slider, value: 0, min: 0, max: 100, step: 1 },
      maxCircles: { type: slider, value: 1000, min: 0, max: 5000, step: 1 },
      growRate: { type: slider, value: 1, min: 0, max: 10, step: 0.25 },
    },
    collapse: true, // TODO: this doesn't work, fix it
  },
  placement: {
    type: radio,
    value: 'forces',
    options: ['random', 'forces'],
  },
  spawnDelay: { type: slider, value: 2, min: 0, max: 1000, step: 0.25 },
  forces: {
    type: group,
    value: {
      repulsionFactor: {
        type: slider,
        value: 1,
        min: -10,
        max: 10,
        step: 0.25,
      },
      maxIntersections: { type: slider, value: 20, min: 0, max: 100, step: 1 },
    },
  },
};

const scale = 0.75;

export const sketcher = new Sketcher({
  title: 'circles',
  width: 1400 * scale,
  height: 1100 * scale,
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
    };

    class Circle {
      pos: p5.Vector;
      vel: p5.Vector;

      radius: number;
      growing: boolean;

      color: p5.Color;

      lifetimeIntersections: number;

      constructor(center: p5.Vector) {
        this.pos = center;
        this.radius = 0;
        this.growing = true;
        this.vel = p.createVector(0, 0);
        this.color = p.color(0);
        this.lifetimeIntersections = 0;
      }

      show() {
        p.push();
        p.fill(this.color);
        p.circle(this.pos.x, this.pos.y, this.radius * 2);
        p.pop();
      }

      update() {
        if (this.growing) {
          this.radius += u.circles.growRate;
        }

        const endHue = p.map(this.pos.x, 0, p.width, 0, 255);
        this.color = p.lerpColor(
          p.color(0),
          p.color(endHue, 56, 125),
          p.map(this.radius, 0, 50, 0, 1)
        );
        this.pos.add(this.vel);
        this.vel.mult(0);
      }

      intersects(other: Circle): boolean {
        const d = p5.Vector.dist(this.pos, other.pos);
        const intersecting = d < this.radius + other.radius + strokeWeight;
        if (intersecting) {
          this.lifetimeIntersections += 1;
        }
        return intersecting;
      }
    }

    function sdf(circle: Circle, other: Circle) {
      return circle.pos.dist(other.pos) - (circle.radius + other.radius);
    }

    const allCircles: Circle[] = new Array(u.circles.maxCircles);
    let numCircles: number;

    const strokeWeight = 5;

    p.setup = function () {
      s.setup(p)();
      numCircles = 0;
    };

    function randomPoint() {
      return p.createVector(
        p.random(-u.circles.margin, p.width + u.circles.margin),
        p.random(-u.circles.margin, p.height + u.circles.margin)
      );
    }

    p.draw = function () {
      p.background(colors.bg);
      p.stroke(colors.fg);
      p.noFill();
      p.strokeWeight(strokeWeight);
      p.colorMode(p.HSB);

      // option 1: choose random points until not inside a circle
      // option 2: choose random point.
      //              If in a circle, move a random direction some factor times the intersecting circle's radius
      // option 3: choose a random point.
      //              If in a circle, follow a flow field defined by existing circles until a free spot is found (repulsion)
      //            (could choose a random minimum radius)
      // option 4: starting point has a velocity which exponentially decays from friction and is propeled /
      //            repulsed by circles until goes beneath some threshold
      // option 5: choose a random point, place a circle
      //            intersecting circles repulse eachother
      //            option 5.a. non-intersecting circles gravitate towards eachother
      //            option 5.b. gravity towards center of the screen

      function randomChoice(): p5.Vector | null {
        for (let i = 0; i < 1000; i++) {
          const c = randomPoint();

          if (
            allCircles
              .slice(0, numCircles)
              .every(
                (circle) => circle.pos.dist(c) > circle.radius + strokeWeight
              )
          ) {
            return c;
          }
        }
        return null;
      }

      function forces(): p5.Vector {
        const c = randomPoint();
        return c;
      }

      // add a circle if we can
      if (
        numCircles < u.circles.maxCircles &&
        p.floor(p.frameCount % u.spawnDelay) == 0
      ) {
        let c;
        switch (u.placement) {
          case 'random':
          default:
            c = randomChoice();
            break;
          case 'forces':
            c = forces();
            break;
        }
        if (c != null) {
          allCircles[numCircles] = new Circle(c);
          numCircles += 1;
        } else {
          console.log('failed to place a new circle, sorry buddy!');
        }
      }

      const circles = allCircles.slice(0, numCircles);
      for (const [i, circle] of circles.entries()) {
        if (u.placement == 'random') {
          for (const other of circles.slice(i + 1)) {
            if (circle.intersects(other)) {
              circle.growing = false;
              other.growing = false;
            }
          }
        } else if (u.placement == 'forces') {
          for (const other of circles) {
            if (circle === other) {
              continue;
            }
            if (circle.intersects(other)) {
              const forceDirection = p5.Vector.sub(
                other.pos,
                circle.pos
              ).normalize();
              const sd = sdf(circle, other) * u.forces.repulsionFactor;
              if (sd < 0) {
                forceDirection.mult(sd);
                circle.vel.set(forceDirection);
              }
            }
          }
          if (circle.lifetimeIntersections > u.forces.maxIntersections) {
            // circle.color = p.color('red');
            circle.growing = false;
          }
        }
      }
      for (const circle of circles) {
        circle.update();
        circle.show();
      }
    };
  },
});
