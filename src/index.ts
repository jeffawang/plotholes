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

        const size = (WIDTH - 2 * MARGIN) / COLS;
        p.translate(MARGIN, MARGIN);
        
        
        
        class Trace {
            public x: number;
            public y: number;
            public life: number;
            public heading: "left" | "right" | "down";
        }
        let traces: Array<Trace> = []
        const popsize = 20;
        const mortality = 0.035;
        const viaradius = 10;
        const bendchance = 0.1;

        // Initialize trace population
        p.angleMode("degrees");
        p.push();
        for (let trace = 0; trace < popsize; trace++){
            p.push();
            const x = trace * (WIDTH / popsize);
            console.log(`x: ${x}, trace: ${trace}`);
            const yoffset = p.randomGaussian(0, 25);
            p.translate(x, yoffset);
            // Start with a via
            p.circle(0, 0, viaradius)
            traces.push(
                {
                    x: x,
                    y: yoffset+viaradius/2,
                    life: 1,
                    heading: "down"
                } as Trace
            );
            p.pop();
        }
        p.pop();
        
        const terminate = trace => {
            p.push();
            p.translate(trace.x, trace.y);
            if (trace.heading === 'left'){
                p.translate(viaradius/2 * p.cos(90-45), viaradius/2 * p.sin(90-45));
            } else if (trace.heading === 'right') {
                p.translate(viaradius/2 * p.cos(90+45), viaradius/2 * p.sin(90+45));
            } else if (trace.heading === 'down') {
                p.translate(0, viaradius/2);
            }
            p.circle(0,0,viaradius);
            p.pop();
        };

        while (traces.length > 0){
            let dead = traces.filter(trace => p.random(0,1) < (mortality / trace.life));
            let alive = traces.filter(trace => dead.indexOf(trace) == -1);
            // Terminate dead traces in a via
            dead.forEach(trace => {
                terminate(trace);
            });

            // Alive traces either continue down, bend, or fork
            alive.forEach((trace, i) => {
                trace.life *= .91;
                p.push();
                p.translate(trace.x, trace.y);
                const choice = p.random(0,1);
                // let dist = p.random(size, 2*size);
                let dist = p.abs(p.randomGaussian(size, size/2));
                let newx:number = 0, newy:number = 0;
                if (choice < 1 * bendchance){
                    trace.heading = "left";
                    dist *= .5;
                    newx = dist * p.cos(90-45);
                    newy = dist * p.sin(90-45);
                    trace.x += newx;
                    trace.y += newy;
                } else if (choice < 2 * bendchance){
                    trace.heading = "right";
                    dist *= .5;
                    newx = dist * p.cos(90+45);
                    newy = dist * p.sin(90+45);
                    trace.x += newx;
                    trace.y += newy;
                } else {
                    trace.heading = "down";
                    trace.y += dist;
                    newy = dist;
                }
                if (i === 0){
                    console.log(`newx: ${newx} newy: ${newy}`)
                }
                p.line(0, 0, newx, newy);
                if (trace.y + newy > HEIGHT-MARGIN){
                    terminate(trace);
                    trace.life = 0.000000000000001;
                }
                p.pop();
            });
            traces = alive;
        }
        /*Pseudocode:
          - Create initial population of traces
          - Draw straight down for $DIST
          - If <rand chance>:
            - bend 45 left
            - bend 45 right
            - fork 45 left
            - fork 45 right
            - continue straight
          - Revert to straight down for <rand total dist>
          */
        // for (let y = 0; y < ROWS; y++) {
    };

    p.keyPressed = function () {
        switch (p.key) {
            case 's':
                p.save(`${TITLE}_${SEED}.svg`);
            case 'r':
                p.redraw();
        }
    }
};

const art = document.getElementById('art') as HTMLElement;

new p5(sketch, art);