import p5 from 'p5';
import { group, radio, slider } from '../components/controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

let controls = {
    amplitude: { type: slider, value: 42, min: 0, max: 100 },
    noiseFactor: { type: slider, value: 0.003, min: 0, max: 0.1, step: 0.001 },
    lines: { type: slider, value: 24, min: 1, max: 50, step: 1 },
    noiseDimensions: { type: radio, value: 'one', options: ['one', 'two'] },
};

export const sketcher = new Sketcher({
    title: 'drapes',
    width: 900,
    height: 900,
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

            const margin = 100;
            const h = p.height - 2 * margin;
            const w = p.width - 2 * margin;

            p.translate(margin, margin);

            p.line(0, 0, w, 0);
            const line = Array(w + 1).fill(0);
            for (let l = 0; l < u.lines - 1; l++) {
                p.beginShape();
                for (let x = 0; x <= w; x += 10) {
                    const noiseY =
                        u.noiseDimensions === 'one'
                            ? undefined
                            : l / u.noiseFactor + p.frameCount * 0.01;
                    line[x] += p.map(
                        p.noise(x * u.noiseFactor, noiseY),
                        0,
                        1,
                        0,
                        u.amplitude
                    );
                    p.vertex(x, p.min(h, line[x]));
                }
                if (l == u.lines - 2) {
                    p.vertex(w, h);
                    p.vertex(0, h);
                    p.endShape(p.CLOSE);
                } else {
                    p.endShape();
                }
            }
        };
    },
});
