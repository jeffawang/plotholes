import p5 from "p5";
import p5svg from "p5.js-svg";
p5svg(p5);

type Params = {
    title: string
    width: number
    height: number
    controls: Controls
    sketch: (p: p5, s: Sketcher) => void

    seed?: number
    loop?: boolean
}

type Controls = {}

class Sketcher {
    params: Params;

    constructor(params: Params) {
        if (params.seed === undefined)
            params.seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        if (params.loop === undefined)
            params.loop = false;
        this.params = params;
    }

    setup(p: p5) {
        return () => {
            // @ts-ignore NOTE(jw): p.SVG gets imperitively added by p5svg, IDE may not understand it, so ts-ignore it.
            p.createCanvas(this.params.width, this.params.height, p.SVG);
            if (!this.params.loop)
                p.noLoop();

            const seed = this.params.seed as number;
            p.randomSeed(seed);
            p.noiseSeed(seed);
            console.log(seed);
        }
    }

    keyPressed(p: p5) {
        return () => {
            switch (p.key) {
                case 's':
                    p.save(`${this.params.title}_${this.params.seed}.svg`);
                    break;
                case 'r':
                    p.redraw();
                    break;
                case ' ':
                    this.params.loop ? p.noLoop() : p.loop();
                    this.params.loop = !this.params.loop;
                    break;
            }
        }
    }

    setDefaults(p: p5) {
        if (p.keyPressed === undefined)
            p.keyPressed = this.keyPressed(p).bind(this)
        if (p.setup === undefined)
            p.setup = this.setup(p).bind(this);
    }

    p5Sketch() {
        return (p: p5) => {
            this.params.sketch(p, this);
            this.setDefaults(p);
        }
    }
}

export { Sketcher, Params, Controls };