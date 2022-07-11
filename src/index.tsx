import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "./theme";

import { sketcher as morphingShapes } from "./sketches/MorphingShapes";
import { SketcherComponent } from "./components/Sketcher";

// @ts-ignore Note(jw): glob imports are a non-standard parcel feature. IDE might not understand.
import * as Sketches from "./sketches/*.ts";
import { SketchIndex } from './components/SketchIndex';
import { HotKeys } from 'react-hotkeys';

const appElement = document.getElementById('app') as HTMLElement;

function App() {
    return <ChakraProvider theme={theme}>
        <Router>
            <Routes>
                {Object.keys(Sketches).map((filename) =>
                    <Route
                        key={filename}
                        path={`/${encodeURIComponent(filename)}`}
                        element={
                            < SketcherComponent sketcher={Sketches[filename].sketcher} />
                        } />)
                }
                <Route path="/" element={<SketchIndex sketches={Sketches} />} />
            </Routes>
        </Router>
    </ChakraProvider>
}

const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<App />);




