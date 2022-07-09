import p5 from "p5";
import p5svg from "p5.js-svg";
p5svg(p5);


const sketch = function (p: p5) {
    // TITLE is interpolated in the filename
    const TITLE = "ripple"

    const WIDTH = 900;
    const HEIGHT = 1200;

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

    let LOOP = false;

    function polyline(points: [number, number][], close: boolean = true) {
        let curr = points[0]
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
        if (!LOOP)
            p.noLoop();
        p.noStroke();


        p.randomSeed(SEED);
        p.noiseSeed(SEED);
        console.log(SEED);
    }

    function sin(startX: number,
        startY: number,
        endX: number,
        amplitude: number,
        period: number,
        sampling: number = 1): [number, number][] {
        const points = new Array<[number, number]>((endX - startX) / sampling);
        for (let i = 0; i < points.length; i++) {
            let x = startX + i * sampling;
            let y = startY + p.sin(x / period * p.TAU) * amplitude;
            points[i] = [x, y];
        }
        return points;
    }

    p.draw = function () {
        p.background(COLORS.BG);
        p.noFill();
        p.stroke(COLORS.FG);
        p.strokeWeight(2);
        p.rectMode("center");

        const size = (WIDTH - 2 * MARGIN) / COLS;

        const startX = WIDTH / 2;
        const startY = HEIGHT / 4;
        const endX = WIDTH - 100;
        const amplitude = 50;
        const period = 200;
        const sampling = 1;

        const RADIAL_COUNT = 100;
        const RADIUS = 420
        p.push();
        p.translate(WIDTH / 2, HEIGHT / 2);
        for (let i = 0; i < RADIAL_COUNT; i++) {

            p.translate(0, 10);
            const points = sin(0, 0, RADIUS, amplitude, period, 5);
            polyline(points);
        }
        p.pop()
        // for (let x = 100; x < 110; x++) {
        //     for (let y = 100; y < 110; y++) {
        //         p.set(x, y, c);
        //     }
        // }
        // p.updatePixels();

        const GRID_SIZE = 10;
        const NOISE_STEP = 0.1;
        p.rectMode(p.CORNER);
        for (let x = 0; x < WIDTH; x += GRID_SIZE) {
            for (let y = 0; y < HEIGHT; y += GRID_SIZE) {
                const n = p.noise(x / GRID_SIZE * NOISE_STEP, y / GRID_SIZE * NOISE_STEP);
                p.push();
                p.noStroke();
                p.fill(p.color(n * 255));
                p.rect(x, y, GRID_SIZE, GRID_SIZE);
                p.pop();
            }
        }
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