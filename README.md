# plotholes

`plotholes` helps rapidly create SVGs for pen plotting, using typescript, `p5`, and `p5.js-svg`.

## Getting started

To make a new piece, run the server and edit the typescript in `src/index.ts`. The http server and browser code should hot reload, so you can see your changes in the browser reflected immediately on save.

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

The `setup` function is called once at startup. The `draw` function is where the drawing code usually lives (remove the call to `noLoop()` for animations). The `keyPressed` function is called when a key is pressed.

For more information on how to generate shapes, check out the [p5js docs](https://p5js.org/reference/). You may find the [`vertex`](https://p5js.org/reference/#/p5/vertex) functions useful. Note that in this project, we use an instanced mode of p5js. This means that functions and constants in the global p5js scope in the docs are namespaced under the `p` object in the code here.

At the start of the sketch, a random seed is pseudorandomly chosen and logged to the console. If you like a particular instance of your piece, you may want to save this number. Just make sure to use `p.random` instead of the built-in random.

### Keybinds in the browser

| key | action |
| --- | ---  |
| `s` | save the result as an svg for plotting. The `title` and seed will be interpolated into the filename (but not the version of the code!). |
| `r` | redraw the sketch once |

## Todo

- [ ] Improve SVG -> pen plotter workflow
    - manual zeroing via eyeballing
    - networked?
- [ ] Figure out svg scaling for plotting