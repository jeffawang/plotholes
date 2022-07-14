import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Box, ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';

import { SketcherComponent } from './components/Sketcher';
import { SketchIndex } from './components/SketchIndex';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Note(jw): glob imports are a non-standard parcel feature. IDE might not understand.
import * as Sketches from './sketches/*.ts';

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
                  <SketcherComponent sketcher={Sketches[filename].sketcher} />
                }
              />
            ))}
            <Route path="/" element={<SketchIndex sketches={Sketches} />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ChakraProvider>
  );
}

const el = document.getElementById('app');
if (el) {
  const root = ReactDOM.createRoot(el);
  root.render(<App />);
}
