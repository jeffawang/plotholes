import p5 from 'p5';
import { checkbox, slider } from '../components/controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

const controls = {
  noiseSize: { type: slider, value: 0.02, min: 0.01, max: 0.05, step: 0.001 },
  gridSize: { type: slider, value: 10, min: 8, max: 100, step: 1 },
  move: { type: slider, value: 5, min: 1, max: 25, step: 1 },
  debug: { type: checkbox, value: false },
};

export const sketcher = new Sketcher({
  title: 'noodle',
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
    const rows = p.floor(s.params.height / u.gridSize);
    const cols = p.floor(s.params.width / u.gridSize);
    const flowfield: p5.Vector[] = new Array(rows * cols);

    class FlowLine {
      pos: p5.Vector;
      vel: p5.Vector;
      acc: p5.Vector;
      prevPos: p5.Vector;

      constructor() {
        this.pos = p.createVector(
          p.random(s.params.width),
          p.random(s.params.height)
        );
        this.vel = p.createVector();
        this.acc = p.createVector();
        this.prevPos = this.pos.copy();
      }

      sample(flowfield: p5.Vector[]) {
        const i = p.floor(this.pos.x / u.gridSize);
        const j = p.floor(this.pos.y / u.gridSize);
        this.acc.set(flowfield[i + j * cols]);
      }

      update() {
        this.prevPos.set(this.pos);
        this.pos.add(this.vel);
        this.edges();
        this.vel.add(this.acc);
        this.vel.limit(u.move);
      }

      edges() {
        if (this.pos.x > s.params.width) {
          this.pos.x = 0;
          this.prevPos.x = 0;
        }
        if (this.pos.x < 0) {
          this.pos.x = s.params.width;
          this.prevPos.x = s.params.width;
        }
        if (this.pos.y > s.params.height) {
          this.pos.y = 0;
          this.prevPos.y = 0;
        }
        if (this.pos.y < 0) {
          this.pos.y = s.params.height;
          this.prevPos.y = s.params.height;
        }
      }

      show() {
        p.stroke(0, 50);
        p.strokeWeight(3);
        // p.point(this.pos.x, this.pos.y);
        p.line(this.prevPos.x, this.prevPos.y, this.pos.x, this.pos.y);
      }
    }

    function fieldSample(x: number, y: number): p5.Vector {
      const n = p.noise(x * u.noiseSize, y * u.noiseSize) * p.TAU * 4;
      return p.createVector(p.cos(n), p.sin(n));
    }

    const colors = {
      bg: p.color(252),
      fg: p.color(0),
      debug: p.color('red'),
    };

    // The setup() function is defaulted by Sketcher,
    //      but it can be overridden in this scope.
    // p.setup = function() { ... }

    const fls = [...new Array(1000)].map(() => {
      return new FlowLine();
    });

    p.draw = function () {
      p.background(colors.bg);
      p.stroke(colors.fg);
      p.strokeWeight(1);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = i + j * cols;
          flowfield[idx] = fieldSample(i, j);
          if (u.debug) {
            const x = i * u.gridSize;
            const y = j * u.gridSize;
            const f = flowfield[idx];
            p.push();
            p.stroke(colors.debug);
            p.line(x, y, x + f.x * 10, y + f.y * 10);
            p.pop();
          }
        }
      }

      for (const fl of fls) {
        fl.sample(flowfield);
        fl.update();
        fl.show();
      }
    };
  },
});
