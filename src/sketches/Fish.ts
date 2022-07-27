import p5 from 'p5';
import { group, radio, slider } from '../components/controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

const controls = {
  r: { type: slider, value: 8, min: 1, max: 100, step: 1 },
  k: { type: slider, value: 20, min: 1, max: 100, step: 1 },
};

export const sketcher = new Sketcher({
  title: 'fish',
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

    p.draw = function () {
      p.background(colors.bg);
      p.stroke(colors.fg);
      p.noFill();
      p.strokeWeight(5);

      const gridSize = u.r / Math.sqrt(2);
      const cols = p.ceil(p.width / gridSize);
      const rows = p.ceil(p.height / gridSize);
      const grid = new Array(cols * rows) as (Point | undefined)[];

      class Point {
        pos: p5.Vector;
        constructor(pos: p5.Vector) {
          this.pos = pos;
        }

        static new(x: number, y: number) {
          return new Point(p.createVector(x, y));
        }

        show() {
          p.point(this.pos);
        }
      }

      function cell(pt: Point) {
        return [p.floor(pt.pos.x / gridSize), p.floor(pt.pos.y / gridSize)];
      }

      function near(pt: Point): boolean {
        const [gx, gy] = cell(pt);
        const x0 = Math.max(0, gx - 2),
          x1 = Math.min(cols, gx + 2),
          y0 = Math.max(0, gy - 2),
          y1 = Math.min(rows, gy + 2);
        for (let cy = y0; cy < y1; cy++) {
          const rowStart = cy * cols;
          for (let cx = x0; cx < x1; cx++) {
            const cellPoint = grid[rowStart + cx];
            if (cellPoint) {
              if (pt.pos.dist(cellPoint.pos) < u.r) {
                return true;
              }
            }
          }
        }
        return false;
      }

      function annulus(pt: Point) {
        // https://stackoverflow.com/questions/9048095/create-random-number-within-an-annulus/9048443#9048443
        const theta = p.random(p.TAU);
        const rMax = u.r * 2;
        const rMin = u.r;
        const A = 2 / (rMax * rMax - rMin * rMin);
        const r = Math.sqrt((2 * Math.random()) / A + rMin * rMin);
        return Point.new(
          pt.pos.x + r * p.cos(theta),
          pt.pos.y + r * p.sin(theta)
        );
      }

      const center = Point.new(p.width / 2, p.height / 2);
      center.show();
      const active = [center];

      const start = Date.now();
      p.stroke('red');
      while (active.length && Date.now() - start < 16) {
        const curr = active.pop() as Point;
        for (let i = 0; i < u.k; i++) {
          const next = annulus(curr);
          if (!near(next)) {
            console.log(next);
            const c = cell(next);
            grid[c[0] + c[1] * cols] = next;
            next.show();
            active.push(next);
            p.push();
            p.strokeWeight(1);
            p.line(curr.pos.x, curr.pos.y, next.pos.x, next.pos.y);
            p.pop();
            break;
          }
        }
        // break;
      }
    };
  },
});
