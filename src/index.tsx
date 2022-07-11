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

const appElement = document.getElementById('app') as HTMLElement;

function App() {
    return <ChakraProvider theme={theme}>
        <>
            <Router>
                <Routes>
                    {Object.keys(Sketches).map((file) => {
                        return <Route path={`/${file}`} element={< SketcherComponent sketcher={Sketches[file].sketcher} />} />;
                    })}
                    <Route path="/" element={<SketcherComponent sketcher={morphingShapes} />} />
                </Routes>
            </Router>
        </>
    </ChakraProvider>
}

const root = ReactDOM.createRoot(document.getElementById("app")!);
root.render(<App />);




