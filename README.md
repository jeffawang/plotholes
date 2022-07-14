# plotholes

`plotholes` helps rapidly create SVGs for pen plotting, using typescript, `p5`, and `p5.js-svg`.

## Getting started

The fastest way to get started is likely to run the server and edit an existing sketch under `src/sketches/`. The http server and browser code should hot reload, so you can see your changes in the browser reflected immediately on save.

To make a new piece, make a new sketch in the `src/sketches/` directory (eg. by copy an existing one and editing it).

Using either of the instruction sets below, the server will be started at `http://localhost:1234`.

### Get started with npm

```bash
# Install deps
npm i

# Run the server (on http://localhost:1234)
npm start
```

### Get started with yarn

I personally use yarn, but you do you.

```bash
# Install deps
yarn

# Run the server (on http://localhost:1234)
yarn start
```

## Coding up some art

Sketches use `p5`, wrapped in some custom metadata and controls.

### Useful p5 concepts

The `setup` function is called once at startup. The `draw` function is where the drawing code usually lives. For penplotting, this project does not run `draw` in a loop by default, but there is a play button that will start the loop. The `keyPressed` function is called when a key is pressed.

For more information on how to generate shapes, check out the [p5js docs](https://p5js.org/reference/). You may find the [`vertex`](https://p5js.org/reference/#/p5/vertex) functions useful for plotting polylines.

Note that in this project, we use an instanced mode of p5js. This means that functions and constants in the global p5js scope in the docs are namespaced under the `p` object in the code here.

At the start of the sketch, a random seed is pseudorandomly chosen. It's logged to the console, and it is shown in the settings panel of the UI (click the gear icon). If you like a particular instance of your piece, you may want to save this number. Just make sure to use `p.random` in your sketch instead of the built-in random.

### Uniforms and Controls

Uniforms are values that can be accessed by your sketch, and Controls represent UI elements to update Uniforms in real time.

The sketch closure's 3rd argument is a Uniforms object -- this will automatically expose values from the controls you've specified in the Sketcher params. This Uniforms object is a proxy accessor into the values, exposing the keys in the controls you specify as keys in the Uniforms object.

For example, if you specify a set of controls like this:

```ts
let controls = {
  amazement: { type: slider, value: 1.5, min: 0, max: 9001 },
};
```

This will create an "amazement" slider, whose value can be accessed inside the sketch closure as `u.amazement`.

### Types of controls

| control type | value type        | description                                       |
| ------------ | ----------------- | ------------------------------------------------- |
| `slider`     | number            | A slider with min, max, step, and starting values |
| `_number`    | number            | A number text input field                         |
| `radio`      | string            | A set of radio buttons                            |
| `checkbox`   | boolean           | A checkbox                                        |
| `group`      | `UniformControls` | A collapsible group of other controls             |

See some of the existing sketches for examples of how to instantiate these controls.

### Keybinds in the browser

| key       | action                                                                                                                                  |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `s`       | save the result as an svg for plotting. The `title` and seed will be interpolated into the filename (but not the version of the code!). |
| `r`       | redraw the sketch once                                                                                                                  |
| `g` / `p` | toggle playing/pausing the sketch.                                                                                                      |

## Todo

- [ ] Improve SVG -> pen plotter workflow
  - manual zeroing via eyeballing
  - networked?
- [ ] Figure out svg scaling for plotting
