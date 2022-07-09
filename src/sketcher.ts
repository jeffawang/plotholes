import p5 from "p5";
import p5svg from "p5.js-svg";
p5svg(p5);

/**
 * Params holds the parameters surrounding the sketch that may also interact
 * with things outside the sketch, such as width, height, controls, and the
 * sketch function itself. This is the main configuration interface into
 * Sketcher.
 */
type Params = {
    title: string
    width: number
    height: number
    controls: Controls

    /**
     * sketch is the main way to access p5 for Sketcher users. Inside this
     * closure, users can do all the normal p5 things with the p argument, and
     * the Sketcher instance is passed through to provide access to Params,
     * Controls, and default functions.
     * 
     * @param p - a p5 object
     * @param s - a Sketcher object to provide access to Params, Controls, etc.
     */
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

    /**
     * setup is used inside of Sketcher to set the default sketch setup
     * function. Users of Sketcher can call it inside their sketch closure to
     * extend it if necessary.
     * 
     * @param p - a p5 object, typically passed through from a p5 sketch closure.
     * @returns a setup closure that can be set on the p5 sketch directly.
     */
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

    /**
     * keyPressed is used inside of Sketcher to set the default sketch
     * keyPressed function. Users of Sketcher can call it inside their sketch
     * closure to extend it if necessary.
     * 
     * @param p - a p5 object, typically passed through from a p5 sketch closure.
     * @returns a setup closure that can be set on the p5 sketch directly.
     */
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

    /**
     * setDefaults defaults the keyPressed and setup functions for the given p5
     * instance if the user did not specify them in the sketch closure.
     * 
     * @param p - a p5 object, typically passed through from a p5 sketch closure.
     */
    setDefaults(p: p5) {
        if (p.keyPressed === undefined)
            p.keyPressed = this.keyPressed(p).bind(this)
        if (p.setup === undefined)
            p.setup = this.setup(p).bind(this);
    }

    /**
     * p5Sketch returns a closure to give to p5, while making the Sketcher
     * instance available to the user inside our sketch closure.
     * 
     * @returns a sketch function suitable to pass to the p5 library.
     */
    p5Sketch() {
        return (p: p5) => {
            this.params.sketch(p, this);
            this.setDefaults(p);
        }
    }
}

export { Sketcher, Params, Controls };