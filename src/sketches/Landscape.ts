import p5 from 'p5';
import {
  slider,
  checkbox,
  radio,
} from '../components/Controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

const controls = {
  style: { type: radio, value: 'fill', options: ['fill', 'line'] },
  count: { type: slider, value: 5, min: 1, max: 100, step: 1 },
  perpcent: { type: slider, value: 0.1, min: 0, max: 0.6, step: 0.01 },
  noise: { type: slider, value: 0.2, min: 0, max: 0.6, step: 0.05 },
  debug: { type: checkbox, value: false },
  iterations: { type: slider, value: 6, min: 1, max: 13, step: 1 },
};

// inspired by Moishe's landscape generator
// https://www.moishelettvin.com/2022/01/20/Landscape-Generator
export const sketcher = new Sketcher({
  title: 'landscape',
  width: 600,
  height: 600,
  controls: controls,
  settings: {
    loop: false,
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

    type line = [p5.Vector, p5.Vector];

    class Landscape {
      // implicit binary tree structure
      lines: line[];
      constructor(start: p5.Vector, end: p5.Vector) {
        this.lines = [[start, end]];
      }

      step() {
        // find all leaf nodes
        for (const line of this.leaves()) {
          // get midpoint
          const midpoint = p5.Vector.lerp(
            line[0],
            line[1],
            0.5 + p.random(-0.5, 0.5) * u.noise
          );
          // get perpendicular unit vector
          const perp = p5.Vector.sub(this.lines[0][0], this.lines[0][1])
            .setMag(1)
            .rotate(p.PI / 2);
          // calculate new point
          let mag =
            p5.Vector.dist(line[0], line[1]) * u.perpcent * p.random(0.5, 1);
          if (p.random(0, 1) > 0.5) {
            mag *= -1;
          }
          const newPoint = midpoint.add(perp.mult(mag));
          this.lines.push([line[0], newPoint], [newPoint, line[1]]);
        }
      }

      draw() {
        p.beginShape();
        if (u.style == 'fill') {
          p.vertex(0.05 * p.width, p.height);
        }
        for (const line of this.leaves()) {
          p.vertex(line[0].x, line[0].y);
        }
        p.vertex(
          this.lines[this.lines.length - 1][1].x,
          this.lines[this.lines.length - 1][1].y
        );
        if (u.style == 'fill') {
          p.vertex(0.95 * p.width, p.height);
        }
        p.endShape();
      }

      leaves() {
        return this.lines.slice(p.floor(this.lines.length / 2));
      }

      debug() {
        p.push();
        p.fill('red');
        for (const node of this.lines) {
          p.circle(node[0].x, node[0].y, 10);
          p.circle(node[1].x, node[1].y, 10);
        }
        p.pop();
      }
    }

    // The setup() function is defaulted by Sketcher,
    //      but it can be overridden in this scope.
    // p.setup = function() { ... }
    let numIterations = 0;

    p.draw = function () {
      p.background(colors.bg);
      p.stroke(colors.fg);
      p.noFill();
      p.strokeWeight(1);
      if (u.style == 'fill') {
        p.noStroke();
      }

      for (let c = 0; c < u.count; c++) {
        p.randomSeed((s.params.settings.seed as number) + c);
        p.noiseSeed((s.params.settings.seed as number) + c);
        let startY = p.map(c, 0, u.count - 1, p.height * 0.1, p.height * 0.9);
        if (u.count == 1) {
          startY = p.height / 2;
        }
        const landscape = new Landscape(
          p.createVector(p.width * 0.05, startY),
          p.createVector(p.width * 0.95, startY)
        );

        for (let i = 0; i < Math.min(numIterations, u.iterations); i++) {
          landscape.step();
        }

        if (u.style == 'fill') {
          p.fill(p.lerpColor(p.color(252), p.color(0), c / u.count));
        }
        landscape.draw();
        if (u.debug) {
          landscape.debug();
        }
      }
      numIterations++;
    };
  },
});
