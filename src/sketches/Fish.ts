import p5 from 'p5';
import { checkbox, slider } from '../components/Controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

const controls = {
  r: { type: slider, value: 8, min: 1, max: 100, step: 1 },
  radius: { type: slider, value: 350, min: 1, max: 1000, step: 1 },
  k: { type: slider, value: 30, min: 1, max: 100, step: 1 },
  lines: { type: checkbox, value: true },
};

// https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf
export const sketcher = new Sketcher({
  title: 'fish',
  width: 800,
  height: 800,
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

    type Maybe<T> = T | undefined;

    class PoissonDisc {
      grid: Maybe<p5.Vector>[];
      gridSize: number;
      cols: number;
      rows: number;

      constructor() {
        this.gridSize = u.r / Math.sqrt(2);
        this.cols = p.ceil(p.width / this.gridSize);
        this.rows = p.ceil(p.height / this.gridSize);
        this.grid = new Array(this.cols * this.rows);
      }

      cell(pt: p5.Vector): [number, number] {
        return [p.floor(pt.x / this.gridSize), p.floor(pt.y / this.gridSize)];
      }

      near(pt: p5.Vector): boolean {
        const [gx, gy] = this.cell(pt);
        const x0 = Math.max(0, gx - 2);
        const x1 = Math.min(this.cols, gx + 2);
        const y0 = Math.max(0, gy - 2);
        const y1 = Math.min(this.rows, gy + 2);
        for (let y = y0; y < y1; y++) {
          const row = y * this.cols;
          for (let x = x0; x < x1; x++) {
            const cellPt = this.grid[row + x];
            if (cellPt) {
              if (pt.dist(cellPt) < u.r) {
                return true;
              }
            }
          }
        }
        return false;
      }

      add(pt: p5.Vector): boolean {
        if (!this.near(pt)) {
          const cell = this.cell(pt);
          this.grid[cell[0] + cell[1] * this.cols] = pt;
          return true;
        }
        return false;
      }
    }

    class Node {
      pos: p5.Vector;
      children: Node[];
      constructor(pos: p5.Vector) {
        this.pos = pos;
        this.children = [];
      }

      join(n: Node) {
        this.children.push(n);
      }

      show(lines: boolean) {
        p.point(this.pos);
        for (const child of this.children) {
          if (lines) {
            p.push();
            p.strokeWeight(1);
            p.line(this.pos.x, this.pos.y, child.pos.x, child.pos.y);
            p.pop();
          }
          child.show(lines);
        }
      }
    }

    function annulus(pt: p5.Vector) {
      // https://stackoverflow.com/questions/9048095/create-random-number-within-an-annulus/9048443#9048443
      const theta = p.random(p.TAU);
      const rMax = u.r * 2;
      const rMin = u.r;
      const A = 2 / (rMax * rMax - rMin * rMin);
      const r = Math.sqrt((2 * Math.random()) / A + rMin * rMin);
      return p.createVector(pt.x + r * p.cos(theta), pt.y + r * p.sin(theta));
    }

    let grid = new PoissonDisc();
    const center = p.createVector(p.width / 2, p.height / 2);
    let graph = new Node(center);
    let queue = [graph];

    function init() {
      grid = new PoissonDisc();
      graph = new Node(center);
      queue = [graph];
    }

    p.setup = function () {
      s.setup(p)();
      init();
    };

    p.draw = function () {
      p.background(colors.bg);
      p.stroke(colors.fg);
      p.noFill();
      p.strokeWeight(5);

      const start = Date.now();
      p.stroke('red');
      while (queue.length && Date.now() - start < 17) {
        const idx = Math.floor(p.random(queue.length));
        const curr = queue[idx];
        let i;
        for (i = 0; i < u.k; i++) {
          const pos = annulus(curr.pos);
          if (pos.dist(center) > u.radius) {
            continue;
          }
          if (pos)
            if (grid.add(pos)) {
              // p.point(next);
              const n = new Node(pos);
              curr.join(n);
              queue.push(n);
            }
        }
        if (i == u.k) {
          // curr.show(u.lines);
          queue[idx] = queue[queue.length - 1];
          queue.pop();
        }
      }
      graph.show(u.lines);
    };
  },
});
