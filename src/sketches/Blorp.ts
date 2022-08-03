import p5 from 'p5';
import {
  checkbox,
  group,
  radio,
  slider,
} from '../components/Controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';
import { effectiveCenter, scaledMargin } from './helpers/Book';

const controls = {
  gridSize: { type: slider, value: 15, min: 3, max: 100 },
  noiseSize: { type: slider, value: 0.05, min: 0, max: 0.01, step: 0.001 },
  type: { type: radio, value: 'swirl', options: ['noise', 'dist', 'swirl'] },
  debug: { type: checkbox, value: false },
};
const scale = 0.75;

export const sketcher = new Sketcher({
  title: 'blorp',
  width: 1400 * 0.75,
  height: 1100 * 0.75,
  controls: controls,
  settings: {
    redrawOnChanges: true,
  },

  sketch: (
    p: p5,
    s: Sketcher<typeof controls>,
    u: Uniforms<typeof controls>
  ) => {
    const MARGIN = scaledMargin(scale);
    const COLORS = {
      BG: p.color(252),
      FG: p.color(0),
    };

    class Cell {
      pos: p5.Vector;
      rot: number;
      size: number;
      constructor(pos: p5.Vector, rot: number, size: number) {
        this.pos = pos;
        this.rot = rot;
        this.size = size;
      }
      show() {
        p.push();
        p.translate(this.pos);
        p.rotate(this.rot);
        p.square(0, 0, this.size);
        p.pop();
      }
    }

    // The setup() function is defaulted by Sketcher,
    //      but it can be overridden in this scope.
    // p.setup = function() { ... }

    p.draw = function () {
      p.background(COLORS.BG);
      p.noFill();
      p.stroke(COLORS.FG);
      p.strokeWeight(1);
      p.rectMode('center');

      const w = p.width - MARGIN.left - MARGIN.right - u.gridSize;
      const h = p.height - MARGIN.top - MARGIN.bottom - u.gridSize;
      const tl = p.createVector(MARGIN.left, MARGIN.top);
      const ec = effectiveCenter(p.width, p.height, MARGIN);

      const rows = Math.ceil(h / u.gridSize);
      const cols = Math.ceil(w / u.gridSize);
      const grid = Array.from({ length: rows * cols }, (_, k) => {
        const x = (k % cols) * u.gridSize;
        const y = Math.floor(k / cols) * u.gridSize;
        return new Cell(p.createVector(x, y).add(tl), 0, u.gridSize);
      });

      console.log('size', rows, cols, rows * cols);

      if (u.debug) {
        p.push();
        p.strokeWeight(10);
        p.stroke('red');
        p.point(ec);
        p.pop();
      }

      for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];
        const x = i % cols;
        const y = Math.floor(i / cols);
        const n = p.noise(x * u.noiseSize, y * u.noiseSize);
        const d = ec.dist(cell.pos);
        const d2 = d * d;
        const factor = 9001 / (d * d + 1);
        const offset = p5.Vector.random2D().mult(factor).mult(10);
        const cn = n - 0.5;
        const v = p5.Vector.sub(cell.pos, ec);
        switch (u.type) {
          case 'noise':
            cell.rot = n * p.TAU;
            cell.size = (0.5 + n) * u.gridSize;
            break;
          case 'dist':
            // cell.size = 100 / d;
            // cell.rot = 100 / d;
            cell.pos.add(offset);
            cell.rot = (p.random() * p.TAU + n * factor * 20000) / (d * d);
            cell.size = u.gridSize * (1 + (2 * cn) / d);
            break;
          case 'swirl':
            // cell.size = 100 / d;
            const c = ec.copy().add(120, 69);
            const myd = c.dist(cell.pos);
            const myd2 = myd * myd;
            const myv = p5.Vector.sub(cell.pos, c);
            cell.rot = (p.random() * v.heading() + 5000) / myd2;
            cell.pos.add(myv.mult((n * 4000) / myd2));
            cell.size = u.gridSize - Math.min(u.gridSize, 5000 / (n * myd2));
            break;
        }
        cell.show();
      }
    };
  },
});
