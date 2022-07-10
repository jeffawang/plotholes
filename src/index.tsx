import p5 from "p5";
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Box, ChakraProvider } from "@chakra-ui/react";

import { theme } from "./theme";
import { Sketcher, Proxy } from "./sketcher";
import { ControlsComponent } from "./components/Controls";
import { slider, group, radio } from "./components/Types";

import { sketcher as schotter } from "./sketches/Schotter";

const art = document.getElementById('art') as HTMLElement;
let p = new p5(schotter.p5Sketch(), art);

const controlsElement = document.getElementById('controls') as HTMLElement;

function App() {
    return <ChakraProvider theme={theme}>
        <Box marginTop={"30px"}>
            <ControlsComponent name={schotter.params.title} uniforms={schotter.params.controls} />
        </Box>
    </ChakraProvider>
}

const root = ReactDOM.createRoot(controlsElement);
root.render(<App />);




