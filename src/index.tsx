import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "./theme";

import { sketcher as morphingShapes } from "./sketches/MorphingShapes";
import { sketcher as schotter } from "./sketches/Schotter";
import { SketcherComponent } from "./components/Sketcher";

const appElement = document.getElementById('app') as HTMLElement;

function App() {
    return <ChakraProvider theme={theme}>
        <SketcherComponent sketcher={morphingShapes} />
    </ChakraProvider>
}

const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<App />);




