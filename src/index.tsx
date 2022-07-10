import p5 from "p5";
import * as ReactDOM from 'react-dom/client';
import { Box, ChakraProvider } from "@chakra-ui/react";

import { theme } from "./theme";
import { Sketcher, Proxy } from "./sketcher";
import { ControlsComponent } from "./components/Controls";
import { slider, group, radio } from "./components/Types";

let controls = {
    shift_factor: { type: slider, value: 1.5, min: 0, max: 10 },
    jitter: { type: slider, value: 0.2, min: 0, max: 1 },
    cols: { type: slider, value: 11, step: 1, max: 50 },
    rows: { type: slider, value: 15, step: 1, max: 50 },
    greeting: { type: radio, value: "hello", options: ["hello", "bonjour", "hola"] },
    mygroup: {
        type: group, value: {
            blah: { type: slider, value: 0.5 }
        }
    }
};

const sketcher = new Sketcher({
    title: "schotter",
    width: 900,
    height: 1200,
    controls: controls,

    sketch: (p: p5, s: Sketcher<typeof controls>, u: Proxy<typeof controls>) => {
        const MARGIN = 100;
        const COLORS = {
            BG: p.color(252),
            FG: p.color(0),
        };

        // The setup() and keyPressed() functions are defaulted by Sketcher,
        //      but they can be overridden in this scope.
        // p.setup = function() { ... }
        // p.keyPressed = function() { ... }

        p.draw = function () {
            p.background(COLORS.BG);
            p.noFill();
            p.stroke(COLORS.FG);
            p.strokeWeight(2);
            p.rectMode("center");

            const size = (s.params.width - 2 * MARGIN) / u.cols;

            p.translate(MARGIN, MARGIN);

            for (let y = 0; y < u.rows; y++) {
                for (let x = 0; x < u.cols; x++) {
                    const yness = y / u.rows + u.jitter;
                    const dy = p.pow(p.random(-yness, yness), 3) * size * u.shift_factor;
                    const dx = p.pow(p.random(-yness, yness), 3) * size * u.shift_factor;
                    const theta = p.random(-p.PI, p.PI) * p.pow(yness, 3);
                    // console.log(dy);
                    p.push();

                    // move to top left of grid cell, then its center.
                    p.translate(x * size, y * size);
                    p.translate(size / 2, size / 2);

                    p.rotate(theta + p.random(-u.jitter, u.jitter));
                    p.rect(dx, dy, size);

                    p.pop();
                }
            }
        };
    }
});

const art = document.getElementById('art') as HTMLElement;
new p5(sketcher.p5Sketch(), art);

const controlsElement = document.getElementById('controls') as HTMLElement;

function App() {
    return <ChakraProvider theme={theme}>
        <Box marginTop={"30px"}>
            <ControlsComponent name={sketcher.params.title} uniforms={sketcher.params.controls} />
        </Box>
    </ChakraProvider>
}

const root = ReactDOM.createRoot(controlsElement);
root.render(<App />);








