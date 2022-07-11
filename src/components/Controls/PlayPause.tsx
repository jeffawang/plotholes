import React, { useEffect, useState } from "react";
import { ButtonGroup, Button } from "@chakra-ui/react";
import { GlobalHotKeys, HotKeys } from "react-hotkeys";

function Butt({ selected, children, onClick }) {
    return selected ?
        <Button
            onClick={onClick}
            borderColor="black"
            color="blue.500"
            _hover={{ bgColor: "blue.200" }}
            _active={{ bgColor: "blue.300", color: "blue.600" }}
        >
            {children}
        </Button>
        :
        <Button onClick={onClick}>{children}</Button>
}

export function PlayPause({ sketcher }) {
    let [state, setState] = useState(sketcher.params.loop);

    // Hotkey keyMap defined in Sketcher.tsx
    const hotkeyHandlers = {
        playpause: (_) => {
            setState((prevState) => {
                sketcher.setLoop(!prevState);
                return !prevState;
            });
        },
        redraw: () => setLoop(false, true)
    };

    const setLoop = (loop: boolean, redraw: boolean = false) => {
        sketcher.setLoop(loop);
        setState(loop);
        if (redraw)
            sketcher.step();
    };

    return <GlobalHotKeys handlers={hotkeyHandlers}>
        <ButtonGroup size='sm' isAttached variant='outline'>
            <Butt selected={state} onClick={() => setLoop(true)}>Play</Butt>
            <Butt selected={!state} onClick={() => setLoop(false)}>Pause</Butt>
            <Butt selected={false} onClick={() => setLoop(false, true)}>Step</Butt>
        </ButtonGroup>
    </GlobalHotKeys >;
}