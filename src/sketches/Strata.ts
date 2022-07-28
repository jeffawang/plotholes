import p5 from 'p5';
import { checkbox, slider } from '../components/Controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

const controls = {
  noiseSize: { type: slider, value: 0.1, min: 0, max: 1, step: 0.01 },
  gridSize: { type: slider, value: 10, min: 1, max: 100, step: 1 },
  strata: { type: slider, value: 2, min: 1, max: 25, step: 1 },
};

export const sketcher = new Sketcher({
  title: 'strata',
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
      bg: p.color(128),
      fg: p.color(255),
    };

    // The setup() function is defaulted by Sketcher,
    //      but it can be overridden in this scope.
    // p.setup = function() { ... }

    p.draw = function () {
      p.background(colors.bg);
      p.stroke(colors.fg);
      p.noFill();
      p.strokeWeight(u.gridSize * 0.5);

      const cols = p.floor(1 + p.width / u.gridSize);
      const rows = p.floor(1 + p.height / u.gridSize);

      const data = [...Array(cols)].map((_, i) =>
        [...Array(rows)].map(
          (_, j) => p.noise(i * u.noiseSize, j * u.noiseSize) * 255
        )
      );

      p.push();
      for (let y = 0; y < cols; y++) {
        for (let x = 0; x < rows; x++) {
          p.stroke(data[y][x]);
          p.point(x * u.gridSize, y * u.gridSize);
        }
      }
      p.pop();

      function stepNoise(threshold: number, x: number, y: number): number {
        return data[y][x] > threshold ? 1 : 0;
      }

      const contour = (threshold: number) => {
        const check = stepNoise.bind(this, threshold);
        p.stroke(colors.fg);
        p.strokeWeight(2);
        for (let i = 0; i < cols - 1; i++) {
          for (let j = 0; j < rows - 1; j++) {
            const x = i;
            const y = j;
            const v =
              8 * check(x, y) +
              4 * check(x + 1, y) +
              2 * check(x + 1, y + 1) +
              1 * check(x, y + 1);
            contourSegment(v, x * u.gridSize, y * u.gridSize, u.gridSize);
          }
        }
      };

      for (let i = 1; i < u.strata; i++) {
        contour((255 * i) / u.strata);
      }
    };

    function line(a: [number, number], b: [number, number]) {
      p.line(a[0], a[1], b[0], b[1]);
    }

    /** contourSegment is a marching squares implementation.
     *
     * @param v a 4-bit number representing above/below threshold values for the points of a grid square.
     * @param x the x value of the top left of the square
     * @param y the y value of the top left of the square
     * @param g the size of the grid in pixels.
     * @returns nothing
     */
    function contourSegment(v: number, x: number, y: number, g: number) {
      // half a grid size.
      const hg = g * 0.5;
      // top, right, bottom, left
      const t: [number, number] = [x + hg, y];
      const r: [number, number] = [x + g, y + hg];
      const b: [number, number] = [x + hg, y + g];
      const l: [number, number] = [x, y + hg];

      // yes, I can use switches, but they add a lot of lines with breaks...
      if (v == 0) return;
      else if (v == 1) line(l, b);
      else if (v == 2) line(b, r);
      else if (v == 3) line(l, r);
      else if (v == 4) line(t, r);
      else if (v == 5) {
        line(l, t);
        line(b, r);
      } else if (v == 6) line(t, b);
      else if (v == 7) line(l, t);
      else if (v == 8) line(l, t);
      else if (v == 9) line(t, b);
      else if (v == 10) {
        line(t, r);
        line(l, b);
      } else if (v == 11) line(t, r);
      else if (v == 12) line(l, r);
      else if (v == 13) line(b, r);
      else if (v == 14) line(l, b);
      else if (v == 15) return;
    }
  },
});
