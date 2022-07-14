import p5 from "p5";
import {
  checkbox,
  group,
  radio,
  slider,
} from "../components/controls/UniformControls";
import { Sketcher, Uniforms } from "../sketcher";

let controls = {
  amplitude: { type: slider, value: 42, min: 0, max: 100 },
  noiseFactor: { type: slider, value: 0.003, min: 0, max: 0.1, step: 0.001 },
  lines: { type: slider, value: 24, min: 1, max: 50, step: 1 },
  noiseDimensions: { type: radio, value: "one", options: ["one", "two"] },
  debug: { type: checkbox, value: true },
};

export const sketcher = new Sketcher({
  title: "bezier",
  width: 900,
  height: 900,
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
      fg: p.color(0),
    };

    // The setup() function is defaulted by Sketcher,
    //      but it can be overridden in this scope.
    // p.setup = function() { ... }

    const margin = 100;
    const h = s.params.height - 2 * margin;
    const w = s.params.width - 2 * margin;
    const randomVec = () => p.createVector(p.random(0, w), p.random(0, h));

    const points = [randomVec(), randomVec(), randomVec(), randomVec()];

    p.draw = function () {
      p.background(colors.bg);
      p.stroke(colors.fg);
      p.noFill();
      p.strokeWeight(2);

      p.translate(margin, margin);

      const debugLine = (v1, v2) => {
        p.push();
        p.stroke(p.color(255, 0, 0));
        p.strokeWeight(10);
        p.point(v1.x, v1.y);
        p.point(v2.x, v2.y);
        p.strokeWeight(1);
        p.line(v1.x, v1.y, v2.x, v2.y);
        p.pop();
      };

      const bez = (bezPoints, debug: boolean = u.debug) => {
        const pts = bezPoints;
        if (debug) {
          debugLine(pts[0], pts[1]);
          debugLine(pts[2], pts[3]);
        }
        p.bezier(
          pts[0].x,
          pts[0].y,
          pts[1].x,
          pts[1].y,
          pts[2].x,
          pts[2].y,
          pts[3].x,
          pts[3].y
        );
      };

      p.randomGaussian(0);

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        const dx = p.randomGaussian(0);
        const dy = p.randomGaussian(0);
        pt.add(dx, dy);
      }

      // points[0] += p.noise(p.frameCount * 0.05) * 10
      bez(points);

      // p.bezier.apply(this, points);

      // p.line(0, 0, w, 0);
      // const line = Array(w + 1).fill(0);
      // for (let l = 0; l < u.lines - 1; l++) {
      //     p.beginShape();
      //     for (let x = 0; x <= w; x += 10) {
      //         const noiseY = u.noiseDimensions === "one" ? undefined : l / u.noiseFactor + p.frameCount * 0.01;
      //         line[x] += p.map(p.noise(x * u.noiseFactor, noiseY), 0, 1, 0, u.amplitude);
      //         p.vertex(x, p.min(h, line[x]));
      //     }
      //     if (l == u.lines - 2) {
      //         p.vertex(w, h);
      //         p.vertex(0, h);
      //         p.endShape(p.CLOSE);
      //     }
      //     else {
      //         p.endShape();
      //     }
      // }
    };
  },
});
