import p5 from "p5";
import { group, radio, slider } from "../components/UniformControls";
import { Sketcher, Uniforms } from "../sketcher";

let controls = {
    radius: { type: slider, value: 100, min: 0, max: 500 },
    factor: { type: slider, value: 100, min: -100, max: 2000 },
    points: { type: slider, value: 10, min: 1, max: 100, step: 1 },
    steps: { type: slider, value: 6, min: 1, max: 100, step: 1 }
};

export const sketcher = new Sketcher({
    title: "morphing shapes",
    width: 900,
    height: 1200,
    controls: controls,
    settings: {
        loop: false,
    },

    sketch: (p: p5, s: Sketcher<typeof controls>, u: Uniforms<typeof controls>) => {
        const MARGIN = 100;
        const COLORS = {
            BG: p.color(252),
            FG: p.color(0),
        };

        // The setup() and keyPressed() functions are defaulted by Sketcher,
        //      but they can be overridden in this scope.
        // p.setup = function() { ... }
        // p.keyPressed = function() { ... }

        const SAMPLES = 200;
        const circle = new Array<[number, number]>(SAMPLES);
        const points = new Array<[number, number]>(SAMPLES);
        const drawingPoints = new Array<[number, number]>(SAMPLES);

        p.draw = function () {
            p.background(COLORS.BG);
            p.noFill();
            p.stroke(COLORS.FG);
            p.strokeWeight(2);

            const start = [s.params.width / 3, s.params.height / 4];
            const end = [s.params.width / 3 * 2, s.params.height / 4 * 3];

            function tri(theta: number, points: number): number {
                const i = points / p.PI;
                return p.abs((theta * i) % 2 - 1) - 0.5;
            }

            function polyline(points: [number, number][], close: boolean = true) {
                p.beginShape();
                for (const point of points)
                    p.vertex(point[0], point[1]);
                if (close)
                    p.vertex(points[0][0], points[0][1]);
                p.endShape();
            }

            for (let i = 0; i < SAMPLES; i++) {
                const theta = p.TAU * i / SAMPLES;
                const r = u.radius + tri(theta, u.points) * u.factor;
                const x = p.cos(theta) * r;
                const y = p.sin(theta) * r;
                points[i] = [x, y];

                const cx = p.cos(theta) * (u.radius);
                const cy = p.sin(theta) * (u.radius);
                console.log(i, [cx, cy])
                circle[i] = [cx, cy];
            }

            for (let i = 0; i < u.steps + 1; i++) {
                for (let j = 0; j < drawingPoints.length; j++) {
                    drawingPoints[j] = [
                        p.lerp(points[j][0], circle[j][0], i / u.steps),
                        p.lerp(points[j][1], circle[j][1], i / u.steps),
                    ];
                }
                const step = [
                    p.lerp(start[0], end[0], i / u.steps),
                    p.lerp(start[1], end[1], i / u.steps),
                ];
                p.push();
                p.translate(step[0], step[1]);
                polyline(drawingPoints);
                p.pop();
            }
        };
    }
});