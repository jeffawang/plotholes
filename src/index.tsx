import p5 from "p5";
import { Controls, Sketcher } from "./sketcher";

import * as ReactDOM from 'react-dom/client';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, ChakraProvider } from "@chakra-ui/react";
import { ControlsComponent } from "./components/Controls";

const sketcher = new Sketcher({
    title: "schotter",
    width: 900,
    height: 1200,
    controls: {},
    sketch: (p: p5, s: Sketcher) => {
        const ROWS = 15;
        const COLS = 11;
        const MARGIN = 100;
        const COLORS = {
            BG: p.color(252),
            FG: p.color(0),
        };
        const JITTER = 0.02;
        const SHIFT_FACTOR = 1.5;

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

            const size = (s.params.width - 2 * MARGIN) / COLS;

            p.translate(MARGIN, MARGIN);

            for (let y = 0; y < ROWS; y++) {
                for (let x = 0; x < COLS; x++) {
                    const yness = y / ROWS + 0.2;
                    const dy = p.pow(p.random(-yness, yness), 3) * size * SHIFT_FACTOR;
                    const dx = p.pow(p.random(-yness, yness), 3) * size * SHIFT_FACTOR;
                    const theta = p.random(-p.PI, p.PI) * p.pow(yness, 3);
                    // console.log(dy);
                    p.push();

                    // move to top left of grid cell, then its center.
                    p.translate(x * size, y * size);
                    p.translate(size / 2, size / 2);

                    p.rotate(theta + p.random(-JITTER, JITTER));
                    p.rect(dx, dy, size);

                    p.pop();
                }
            }
        };
    }
});

const art = document.getElementById('art') as HTMLElement;
new p5(sketcher.p5Sketch(), art);

const blah = document.getElementById('blah') as HTMLElement;

function App() {
    return <ChakraProvider>
        <ControlsComponent name={sketcher.params.title} />
    </ChakraProvider>
}

// render(<h1>wtf</h1>, blah);
const root = ReactDOM.createRoot(blah);
root.render(<App />);








