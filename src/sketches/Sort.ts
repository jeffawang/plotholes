import p5 from 'p5';
import {
  button,
  checkbox,
  slider,
  UniformButton,
  UniformSlider,
} from '../components/Controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

const controls = {
  count: { type: slider, value: 50, min: 1, max: 100, step: 1 },
  step: { type: button },
  autoplay: { type: checkbox, value: false },
};

export const sketcher = new Sketcher({
  title: 'sort',
  width: 800,
  height: 800,
  controls: controls,
  settings: {
    loop: true,
    redrawOnChanges: true,
  },

  sketch: (
    p: p5,
    s: Sketcher<typeof controls>,
    u: Uniforms<typeof controls>
  ) => {
    const colors = {
      bg: p.color(252),
      fg: p.color(50),
    };

    let numbers: number[];
    let idx: number;
    let len: number;

    function init() {
      numbers = Array.from({ length: u.count }, () =>
        Math.floor(Math.random() * 100)
      );
      idx = 0;
      len = numbers.length;
    }
    init();

    function bubbleStep() {
      if (len <= 1) {
        console.log('done');
        idx = -1;
        len = 0;
        return;
      }
      if (idx >= len) {
        idx = 0;
        len--;
      }
      const m = numbers[idx];
      const n = numbers[idx + 1];

      if (n < m) {
        // swap
        [numbers[idx], numbers[idx + 1]] = [numbers[idx + 1], numbers[idx]];
      }
      idx++;
    }

    (s.params.controls.count as UniformSlider).onChange = init;
    (s.params.controls.step as UniformButton).onClick = bubbleStep;

    p.draw = function () {
      p.background(colors.bg);
      p.stroke(colors.fg);
      // p.noFill();
      p.strokeWeight(1);
      p.fill(200);

      const max = Math.max(...numbers);
      for (let i = 0; i < numbers.length; i++) {
        const n = numbers[i];
        const x = p.map(i, 0, numbers.length, p.width * 0.05, p.width * 0.95);
        const bottom = p.height * 0.95;
        const height = p.map(n, 0, max, 0, p.height * 0.9);
        // p.line(x, bottom, x, bottom - height);
        p.push();
        if (i == idx) {
          p.fill('red');
        }
        if (i >= len) {
          p.fill(150);
        }
        p.rect(x, bottom - height, (p.width * 0.9) / numbers.length, height);
        p.pop();
      }
      if (u.autoplay) {
        bubbleStep();
      }
    };
  },
});
