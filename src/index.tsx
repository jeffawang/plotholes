import p5 from "p5";
import * as React from 'react';
import { useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom/client';
import { Box, ChakraProvider } from "@chakra-ui/react";

import { theme } from "./theme";
import { Sketcher, Proxy } from "./sketcher";
import { ControlsComponent } from "./components/Controls";
import { slider, group, radio, UniformControls } from "./components/Types";

import { sketcher as schotter } from "./sketches/Schotter";

const art = document.getElementById('art') as HTMLElement;
// let p = new p5(schotter.p5Sketch(), art);

const appElement = document.getElementById('app') as HTMLElement;

function Plot<UC extends UniformControls>(sketcher: Sketcher<UC>) {
    const elRef = useRef()
    useEffect(() => {
        new p5(schotter.p5Sketch(), elRef.current);
    }, [])
    return <Box ref={elRef}></Box>
}

function App() {
    console.log(schotter)
    return <ChakraProvider theme={theme}>
        <Box display="flex">
            <Box marginTop={"30px"} padding="20px" minWidth="270px">
                <ControlsComponent name={schotter.params.title} uniforms={schotter.params.controls} />
            </Box>
            <Box boxShadow={"0px 10px 30px #aaa"} >
                <Plot<UniformControls> sketcher={schotter} />
            </Box>
        </Box>
    </ChakraProvider>
}

const root = ReactDOM.createRoot(appElement);
root.render(<App />);




