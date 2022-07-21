import p5 from 'p5';
import { checkbox, slider } from '../components/controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

const controls = {
  noiseSize: { type: slider, value: 0.1, min: 0, max: 1, step: 0.01 },
  gridSize: { type: slider, value: 10, min: 1, max: 100, step: 1 },
  strata: { type: slider, value: 2, min: 1, max: 25, step: 1 },
  debug: { type: checkbox, value: true },
};

export const sketcher = new Sketcher({
  title: 'flow',
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
      debug: p.color('red'),
    };

    // The setup() function is defaulted by Sketcher,
    //      but it can be overridden in this scope.
    // p.setup = function() { ... }

    p.draw = function () {
      p.background(colors.bg);
      p.stroke(colors.fg);
      p.noFill();
      p.strokeWeight(1);

      const cols = p.floor(1 + p.width / u.gridSize);
      const rows = p.floor(1 + p.height / u.gridSize);

      function noise(x: number, y: number): number {
        return p.noise(x, y) * p.TAU;
      }

      // Draw debug flow field lines
      if (u.debug) {
        const len = 8;
        p.push();
        p.stroke(colors.debug);
        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const x = i * u.gridSize;
            const y = j * u.gridSize;
            const n = noise(i * u.noiseSize, j * u.noiseSize);
            p.line(x, y, x + len * p.cos(n), y + len * p.sin(n));
          }
        }
        p.pop();
      }
    };
  },
});
