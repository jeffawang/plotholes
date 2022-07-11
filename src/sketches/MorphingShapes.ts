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
    settings: {},

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
        const circle = [...Array<p5.Vector>(SAMPLES)].map(() => p.createVector());
        const points = [...Array<p5.Vector>(SAMPLES)].map(() => p.createVector());
        const drawingPoints = [...Array<p5.Vector>(SAMPLES)].map(() => p.createVector());

        p.draw = function () {
            p.background(COLORS.BG);
            p.noFill();
            p.stroke(COLORS.FG);
            p.strokeWeight(2);

            const start = p.createVector(s.params.width / 3, s.params.height / 4);
            const end = p.createVector(s.params.width / 3 * 2, s.params.height / 4 * 3);

            function tri(theta: number, points: number): number {
                const i = points / p.PI;
                return p.abs((theta * i) % 2 - 1) - 0.5;
            }

            function polyline(points: p5.Vector[], close: boolean = true) {
                p.beginShape();
                for (const point of points)
                    p.vertex(point.x, point.y);
                if (close)
                    p.vertex(points[0].x, points[0].y);
                p.endShape();
            }

            for (let i = 0; i < SAMPLES; i++) {
                const theta = p.TAU * i / SAMPLES;
                const r = u.radius + tri(theta, u.points) * u.factor;

                points[i].set(
                    p.cos(theta) * r,
                    p.sin(theta) * r
                );
                circle[i].set(
                    p.cos(theta) * u.radius,
                    p.sin(theta) * u.radius
                );
            }


            p.translate(start);
            const step = p.createVector().lerp(end.sub(start), 1 / u.steps);
            for (let i = 0; i <= u.steps; i++) {
                const lerpAmount = i / u.steps;
                for (let j = 0; j < drawingPoints.length; j++)
                    drawingPoints[j] = points[j].lerp(circle[j], lerpAmount);

                polyline(drawingPoints);
                p.translate(step);
            }
        };
    }
});