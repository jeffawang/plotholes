import p5 from 'p5';
import {
  checkbox,
  group,
  radio,
  slider,
  UniformControls,
} from '../components/controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

const controls = {
  circles: {
    type: group,
    value: {
      margin: { type: slider, value: 0, min: 0, max: 100, step: 1 },
      maxCircles: { type: slider, value: 500, min: 0, max: 5000, step: 1 },
      growRate: { type: slider, value: 1, min: 0, max: 10, step: 0.25 },
    },
    collapse: true, // TODO: this doesn't work, fix it
  },
  placement: {
    type: radio,
    value: 'random',
    options: ['random', 'forces'],
  },
  spawnDelay: { type: slider, value: 30, min: 0, max: 1000, step: 0.25 },
  forces: {
    type: group,
    value: {
      repulsionFactor: { type: slider, value: 100, min: 0, max: 1000, step: 1 },
    },
  },
};

export const sketcher = new Sketcher({
  title: 'circles',
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
    };

    class Circle {
      center: p5.Vector;
      r: number;
      growing: boolean;
      constructor(center: p5.Vector) {
        this.center = center;
        this.r = 0;
        this.growing = true;
      }

      show() {
        p.circle(this.center.x, this.center.y, this.r * 2);
      }

      tryGrow() {
        if (this.growing) {
          this.r += u.circles.growRate;
        }
      }

      intersects(other: Circle): boolean {
        const d = p5.Vector.dist(this.center, other.center);
        return d < this.r + other.r + strokeWeight;
      }
    }

    const circles: Circle[] = new Array(u.circles.maxCircles);
    let numCircles: number;

    const strokeWeight = 5;

    p.setup = function () {
      s.setup(p)();
      numCircles = 0;
    };

    p.draw = function () {
      p.background(colors.bg);
      p.stroke(colors.fg);
      p.noFill();
      p.strokeWeight(strokeWeight);

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
          const c = p.createVector(
            p.random(-u.circles.margin, p.width + u.circles.margin),
            p.random(-u.circles.margin, p.height + u.circles.margin)
          );

          if (
            circles
              .slice(0, numCircles)
              .every(
                (circle) => circle.center.dist(c) > circle.r + strokeWeight
              )
          ) {
            return c;
          }
        }
        return null;
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
            // c = forces();
            break;
        }
        if (c != null) {
          circles[numCircles] = new Circle(c);
          numCircles += 1;
        } else {
          console.log('failed to place a new circle, sorry buddy!');
        }
      }

      for (let i = 0; i < numCircles; i++) {
        for (let j = i + 1; j < numCircles; j++) {
          if (circles[i].intersects(circles[j])) {
            circles[i].growing = false;
            circles[j].growing = false;
          }
        }
        circles[i].tryGrow();
        circles[i].show();
      }
    };
  },
});
