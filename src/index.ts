import p5 from "p5";
import p5svg from "p5.js-svg";
p5svg(p5);


const sketch = function (p: p5) {
    // TITLE is interpolated in the filename
    const TITLE = "schotter"

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

    let LOOP = true;

    let capture: p5.Element;

    p.setup = function () {
        // NOTE(jw): p.SVG gets imperitively added by p5svg, IDE may not understand it
        p.createCanvas(WIDTH, HEIGHT);
        if (!LOOP)
            p.noLoop();
        p.noStroke();

        capture = p.createCapture(p.VIDEO);
        capture.size(WIDTH, HEIGHT * 320 / 240);
        capture.hide();

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

        const size = (WIDTH - 2 * MARGIN) / COLS;

        // p.translate(MARGIN, MARGIN);

        p.image(capture, 0, 0, WIDTH, HEIGHT * 1080 / 1920);
        p.loadImage
        p.get()
        capture.loadPixels();
        console.log(capture.pixels[0]);

        // for (let y = 0; y < ROWS; y++) {
        //     for (let x = 0; x < COLS; x++) {
        //         const yness = y / ROWS + 0.2;
        //         const dy = p.pow(p.random(-yness, yness), 3) * size * SHIFT_FACTOR;
        //         const dx = p.pow(p.random(-yness, yness), 3) * size * SHIFT_FACTOR;
        //         const theta = p.random(-p.PI, p.PI) * p.pow(yness, 3);
        //         // console.log(dy);
        //         p.push();

        //         // move to top left of grid cell, then its center.
        //         p.translate(x * size, y * size);
        //         p.translate(size / 2, size / 2);

        //         p.rotate(theta + p.random(-JITTER, JITTER));
        //         p.rect(dx, dy, size);

        //         p.pop();
        //     }
        // }
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