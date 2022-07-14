import p5 from "p5";
import { group, radio, slider } from "../components/Controls/UniformControls";
import { Sketcher, Uniforms } from "../sketcher";

let controls = {
  shift_factor: { type: slider, value: 1.5, min: 0, max: 10 },
  jitter: { type: slider, value: 0.2, min: 0, max: 1 },
  greeting: {
    type: radio,
    value: "hello",
    options: ["hello", "bonjour", "hola"],
  },
  dimensions: {
    type: group,
    value: {
      cols: { type: slider, value: 11, step: 1, max: 50 },
      rows: { type: slider, value: 15, step: 1, max: 50 },
    },
  },
};

export const sketcher = new Sketcher({
  title: "schotter",
  width: 900,
  height: 1200,
  controls: controls,
  settings: {},

  sketch: (
    p: p5,
    s: Sketcher<typeof controls>,
    u: Uniforms<typeof controls>
  ) => {
    const MARGIN = 100;
    const COLORS = {
      BG: p.color(252),
      FG: p.color(0),
    };

    // The setup() function is defaulted by Sketcher,
    //      but it can be overridden in this scope.
    // p.setup = function() { ... }

    p.draw = function () {
      p.background(COLORS.BG);
      p.noFill();
      p.stroke(COLORS.FG);
      p.strokeWeight(2);
      p.rectMode("center");

      const size = (s.params.width - 2 * MARGIN) / u.dimensions.cols;

      p.translate(MARGIN, MARGIN);

      for (let y = 0; y < u.dimensions.rows; y++) {
        for (let x = 0; x < u.dimensions.cols; x++) {
          const yness = y / u.dimensions.rows + u.jitter;
          const dy = p.pow(p.random(-yness, yness), 3) * size * u.shift_factor;
          const dx = p.pow(p.random(-yness, yness), 3) * size * u.shift_factor;
          const theta = p.random(-p.PI, p.PI) * p.pow(yness, 3);

          p.push();

          // move to top left of grid cell, then its center.
          p.translate(x * size, y * size);
          p.translate(size / 2, size / 2);

          p.rotate(theta + p.random(-u.jitter, u.jitter));
          p.rect(dx, dy, size);

          p.pop();
        }
      }
    };
  },
});
