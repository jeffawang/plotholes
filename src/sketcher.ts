import p5 from "p5";
import p5svg from "p5.js-svg";
import { checkbox, group, radio, slider, UniformControl, UniformControls, UniformGroup } from "./components/Types";
p5svg(p5);

/**
 * Params holds the parameters surrounding the sketch that may also interact
 * with things outside the sketch, such as width, height, controls, and the
 * sketch function itself. This is the main configuration interface into
 * Sketcher.
 */
type Params<UC extends UniformControls> = {
    title: string
    width: number
    height: number
    controls: UC

    /**
     * sketch is the main way to access p5 for Sketcher users. Inside this
     * closure, users can do all the normal p5 things with the p argument, and
     * the Sketcher instance is passed through to provide access to Params,
     * Controls, and default functions.
     * 
     * @param p - a p5 object
     * @param s - a Sketcher object to provide access to Params, Controls, etc.
     */
    sketch: (p: p5, s: Sketcher<UC>, u: Proxy<UC>) => void

    seed?: number
    loop?: boolean
}

/** Proxy<UC> takes a UniformControls type parameter and proxies access to it.
 * For example, there is a slider with a name `hello`, accesses to the proxy of
 * that slider to `hello` will access the `value` field within the object under
 * `hello`.
 * 
 * This enables access to the uniform values like this: `u.hello`, rather than
 * the more cumbersome `u.hello.value`.
 * 
 * For nested groups, this effect is amplified, allowing access like
 * `u.mygroup.nestedgroup.hello` rather than
 * `u.mygroup.value.nestedgroup.value.hello.value`.
 * 
 * This access pattern also prevents accidentally modifying the uniform control
 * values in the sketch while just trying to access the uniform values.
 * */
export type Proxy<UC extends UniformControls> = {
    [Property in keyof UC]: UC[Property] extends UniformGroup ? Proxy<UC[Property]["value"]> : UC[Property]["value"]
}

type Settings = ReturnType<InstanceType<typeof Sketcher>["newSettingsControls"]>;

class Sketcher<UC extends UniformControls> {
    params: Params<UC>;
    uniforms: UC | Proxy<UC>;
    settingsControls: Settings;
    settings: Settings["settings"]["value"] | Proxy<Settings["settings"]["value"]>;

    constructor(params: Params<UC>) {
        if (params.seed === undefined)
            params.seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        if (params.loop === undefined)
            params.loop = false;
        this.params = params;
        this.uniforms = new Proxy(params.controls, { get: this.getUniform.bind(this) });

        this.settingsControls = this.newSettingsControls();
        this.settings = new Proxy(this.settingsControls.settings.value, { get: this.getUniform.bind(this) });
    }

    newSettingsControls() {
        return {
            settings: {
                type: group, value: {
                    loop: { type: checkbox, value: this.params.loop as boolean },
                    autoresize: { type: checkbox, value: false },
                }
            }
        };
    }

    getUniform(target, prop, receiver) {
        const uniform = target[prop];
        if (uniform.type === "group")
            return new Proxy(uniform.value, { get: this.getUniform.bind(this) });
        return uniform.value;
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
            this.params.sketch(p, this, this.uniforms as Proxy<UC>);
            this.setDefaults(p);
        }
    }
}

export { Sketcher, Params };