import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Box, ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';

import { SketcherComponent } from './components/Sketcher';
import { SketchIndex } from './components/SketchIndex';

// @ts-ignore Note(jw): glob imports are a non-standard parcel feature. IDE might not understand.
import * as Sketches from './sketches/*.ts';

const appElement = document.getElementById('app') as HTMLElement;

function App() {
    return (
        <ChakraProvider theme={theme}>
            <Box padding="30px">
                <BrowserRouter>
                    <Routes>
                        {Object.keys(Sketches).map((filename) => (
                            <Route
                                key={filename}
                                path={`/${encodeURIComponent(filename)}`}
                                element={
                                    <SketcherComponent
                                        sketcher={Sketches[filename].sketcher}
                                    />
                                }
                            />
                        ))}
                        <Route
                            path="/"
                            element={<SketchIndex sketches={Sketches} />}
                        />
                    </Routes>
                </BrowserRouter>
            </Box>
        </ChakraProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app')!);
root.render(<App />);
