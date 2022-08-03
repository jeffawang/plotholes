import p5 from 'p5';
import {
  button,
  checkbox,
  group,
  radio,
  slider,
  UniformButton,
  UniformRadio,
  UniformSlider,
} from '../components/Controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';
import PoissonDisc from './helpers/PoissonDisc';
import { scaledMargin, effectiveCenter } from './helpers/Book';

const controls = {
  iterations: { type: slider, value: 13, min: 0, max: 20, step: 1 },
  zoom: { type: slider, value: 175, min: 0, max: 200, step: 1 },
};

export const sketcher = new Sketcher({
  title: 'dragon',
  width: 1400 * 0.75,
  height: 1100 * 0.75,
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

    function dragon(s: string): string {
      let result = '';
      for (let i = 0; i < s.length; i++) {
        const c = s.charAt(i);
        if (c === 'F') result += 'F+G';
        else if (c === 'G') result += 'F-G';
        else result += c;
      }
      return result;
    }

    function draw(s: string, a: number, l: number) {
      p.push();
      p.beginShape();
      p.vertex(0, 0);
      for (let i = 0; i < s.length; i++) {
        const c = s.charAt(i);
        switch (c) {
          case 'F':
          case 'G':
            p.line(0, 0, 0, l);
            p.translate(0, l);
            break;
          case '-':
            p.rotate(-a);
            break;
          case '+':
            p.rotate(a);
            break;
          default:
            console.warn('draw got unknown input!!');
            break;
        }
      }
      p.endShape();
      p.pop();
    }

    p.draw = function () {
      p.background(COLORS.BG);
      p.stroke(COLORS.FG);
      p.strokeWeight(5);
      p.noFill();

      const center = p.createVector(p.width / 2, p.height / 2);

      let s = 'F';
      for (let i = 0; i < u.iterations; i++) {
        s = dragon(s);
      }
      p.translate(center);
      p.translate(120, 210);
      p.rotate(-p.PI / 6);
      p.scale(10 / u.zoom);
      draw(s, p.HALF_PI, 100);
    };
  },
});
