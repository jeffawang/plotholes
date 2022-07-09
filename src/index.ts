import p5 from "p5";
import p5svg from "p5.js-svg";
p5svg(p5);


const sketch = function (p: p5) {
    // TITLE is interpolated in the filename
    const TITLE = "croissant"

    const WIDTH = 875;
    const HEIGHT = 575;

    const ROWS = 15;
    const COLS = 11;

    const MARGIN = 100;

    const JITTER = 0.02;
    const SHIFT_FACTOR = 1.5;

    const COLORS = {
        BG: p.color(252),
        FG: p.color(0),
    };

    const SEED = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

    let LOOP = true;

    function polyline(points: [number, number][], close: boolean = true) {
        let curr = points[0]
        console.log(points)
        for (let i = 1; i < points.length; i++) {
            const next = points[i];
            p.line(curr[0], curr[1], next[0], next[1]);
            curr = next;
        }
    }

    function circle(cx: number, cy: number, r: number, samples: number = 100): [number, number][] {
        r /= 2;
        let currX = cx + r;
        let currY = cy;
        const points = new Array<[number, number]>(samples);

        for (let i = 0; i <= samples; i++) {
            const pct = i / samples;
            const x = cx + r * p.cos(p.TAU * pct);
            const y = cy + r * p.sin(p.TAU * pct);
            points[i] = [x, y];
        }
        return points;
    }

    p.setup = function () {
        // NOTE(jw): p.SVG gets imperitively added by p5svg, IDE may not understand it
        p.createCanvas(WIDTH, HEIGHT, p.SVG);
        p.noLoop();
        p.noStroke();


        p.randomSeed(SEED);
        p.noiseSeed(SEED);
        console.log(SEED);
    }

    p.draw = function () {
        p.background(COLORS.BG);
        p.noFill();
        p.stroke(COLORS.FG);
        p.strokeWeight(2);
        p.rectMode("center");

        const radius = 100;
        p.translate(WIDTH / 2, HEIGHT / 2);
        // p.circle(0, 0, 100);

        const NUM_CIRCLES = 25;
        const NUM_LAYERS = 18;
        for (let i = 0; i < NUM_CIRCLES; i++) {
            const theta = i / NUM_CIRCLES * p.TAU;
            const x = p.cos(theta) * radius;
            const y = p.sin(theta) * radius;
            // p.ar(x, y, radius);
            // p.arc(x, y, radius, radius, theta, theta + p.PI);
            for (let i = 0; i < NUM_LAYERS; i++) {
                const pct = i / NUM_LAYERS;
                const a = theta + pct * p.PI;
                const sx = x + p.cos(a) * radius;
                const sy = y + p.sin(a) * radius;
                const r = (p.sin(p.PI * pct)) * 10;
                p.circle(sx, sy, r);
            }
        }


        // const circles = new Array<[number, number][]>(NUM_CIRCLES);
        // for (let i = 0; i < NUM_CIRCLES; i++) {
        //     const theta = i / NUM_CIRCLES * 2 * p.PI;
        //     const x = p.cos(theta) * radius;
        //     const y = p.sin(theta) * radius;
        //     circles[i] = circle(x, y, radius + p.sin(theta) * 100, 69);
        // }

        // for (const circle of circles) {
        //     polyline(circle, true);
        // }
        // circle(0, 0, 100);
    };

    p.keyPressed = function () {
        switch (p.key) {
            case 's':
                p.save(`${TITLE}_${SEED}.svg`);
                break;
            case 'r':
                p.redraw();
                break;
            case ' ':
                LOOP ? p.noLoop() : p.loop();
                LOOP = !LOOP;
                break;
        }
    }
};

const art = document.getElementById('art') as HTMLElement;

new p5(sketch, art);