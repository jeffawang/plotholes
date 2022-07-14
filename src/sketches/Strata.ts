import p5 from 'p5';
import { slider } from '../components/controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

const controls = {
  noiseSize: { type: slider, value: 0.05, min: 0, max: 0.1, step: 0.001 },
  strata: { type: slider, value: 10, min: 1, max: 10, step: 1 },
};

export const sketcher = new Sketcher({
  title: 'strata',
  width: 420,
  height: 420,
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

    // The setup() function is defaulted by Sketcher,
    //      but it can be overridden in this scope.
    // p.setup = function() { ... }

    p.draw = function () {
      p.background(colors.bg);
      p.stroke(colors.fg);
      p.noFill();
      p.strokeWeight(2);
      p.noStroke();

      const margin = 0;
      const w = p.width - 2 * margin;
      const h = p.height - 2 * margin;
      const grid = 5;

      p.translate(margin, margin);

      for (let x = 0; x < w; x += grid) {
        for (let y = 0; y < h; y += grid) {
          const n = p.noise(x * u.noiseSize, y * u.noiseSize);
          const fn = p.floor(n * u.strata) / u.strata;
          p.fill(fn * 255);
          p.rect(x, y, grid);
        }
      }
    };
  },
});
