import p5 from 'p5';
import { slider } from '../components/controls/UniformControls';
import { Sketcher, Uniforms } from '../sketcher';

let controls = {
    points: { type: slider, value: 50, min: 1, max: 50, step: 2 },
    step: { type: slider, value: 21, min: 1, max: 50, step: 1 },
    hop: { type: slider, value: 1, min: -5, max: 5, step: 1 },
    radius: { type: slider, value: 200, min: 0, max: 500 },
};

export const sketcher = new Sketcher({
    title: 'bagel',
    width: 420,
    height: 420,
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

            p.translate(p.width / 2, p.height / 2);

            const points: Array<p5.Vector> = Array(u.points);

            const dt = p.TAU / u.points;

            for (let i = 0; i < u.points; i++) {
                const x = p.cos(dt * i) * u.radius;
                const y = p.sin(dt * i) * u.radius;
                points[i] = p.createVector(x, y);
            }

            let i = 0;
            let pt = points[0];

            p.beginShape();
            for (let _ = 0; _ < points.length; _ += 1) {
                p.vertex(pt.x, pt.y);

                if (u.hop != 0) {
                    i = (i + u.hop + points.length) % points.length;
                    pt = points[i];
                    p.vertex(pt.x, pt.y);
                }
                i = (i + u.step) % points.length;
                pt = points[i];
            }
            p.endShape(p.CLOSE);
        };
    },
});
