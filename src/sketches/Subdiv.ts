import p5 from 'p5';
import { slider } from '../components/Controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';
import { scaledMargin } from './helpers/Book';

const controls = {};

const scale = 0.75;
export const sketcher = new Sketcher({
  title: 'subdiv',
  width: 1400 * scale,
  height: 1100 * scale,
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
    const COLORS = {
      BG: p.color(252),
      FG: p.color(42),
    };

    type direction = 'h' | 'v';

    class Subdiv {
      pos: p5.Vector;
      w: number;
      h: number;

      l?: Subdiv;
      r?: Subdiv;

      direction: direction;

      constructor(direction: direction, w: number, h: number, pos: p5.Vector) {
        this.direction = direction;
        this.w = w;
        this.h = h;
        this.pos = pos;
      }
      show() {
        p.rect(this.pos.x, this.pos.y, this.w, this.h);
        if (this.l) this.l.show();
        if (this.r) this.r.show();
      }

      div(depth: number) {
        if (depth <= 0) return [];
        console.log(depth);
        const dir = Math.random() > 0.5 ? 'h' : 'v';
        const amt = Math.random() * 0.5 + 0.25;
        const w = dir == 'h' ? this.w * amt : this.w;
        const h = dir == 'v' ? this.h * amt : this.h;
        const lpos = this.pos.copy();
        const rpos = this.pos.copy();
        this.l = new Subdiv(dir, w, h, lpos);
        this.r = new Subdiv(dir, w, h, rpos);
        return [this.l, this.r, ...this.l.div(depth - 1)];
      }
    }

    const MARGIN = scaledMargin(scale);

    p.draw = function () {
      p.background(COLORS.BG);
      p.stroke(COLORS.FG);
      p.strokeWeight(2);
      p.noFill();

      const w = p.width - MARGIN.left - MARGIN.right;
      const h = p.height - MARGIN.top - MARGIN.bottom;

      const start = p.createVector(MARGIN.left, MARGIN.top);

      const s = new Subdiv('h', w, h, start);
      s.div(30);
      s.show();
    };
  },
});
