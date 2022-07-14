import React, { useState } from 'react';
import { ButtonGroup, Button } from '@chakra-ui/react';
import { GlobalHotKeys } from 'react-hotkeys';
import { Sketcher } from '../../sketcher';
import { UniformControls } from './UniformControls';

function Butt({
    selected,
    children,
    onClick,
}: {
    selected: boolean;
    children: React.ReactNode;
    onClick: () => void;
}) {
    return selected ? (
        <Button
            onClick={onClick}
            borderColor="black"
            color="blue.500"
            _hover={{ bgColor: 'blue.200' }}
            _active={{ bgColor: 'blue.300', color: 'blue.600' }}
            zIndex={2}
            _focus={{ zIndex: 2 }}
        >
            {children}
        </Button>
    ) : (
        <Button onClick={onClick} zIndex={1}>
            {children}
        </Button>
    );
}

export default function PlayPauseControl<UC extends UniformControls>({
    sketcher,
}: {
    sketcher: Sketcher<UC>;
}) {
    const [state, setState] = useState(sketcher.params.settings.loop || false);

    // Hotkey keyMap defined in Sketcher.tsx
    const hotkeyHandlers = {
        playpause: () => {
            setState((prevState) => {
                sketcher.setLoop(!prevState);
                return !prevState;
            });
        },
        redraw: () => setLoop(false, true),
    };

    const setLoop = (loop: boolean, redraw = false) => {
        sketcher.setLoop(loop);
        setState(loop);
        if (redraw) sketcher.step();
    };

    return (
        <GlobalHotKeys handlers={hotkeyHandlers}>
            <ButtonGroup size="sm" isAttached variant="outline">
                <Butt selected={state} onClick={() => setLoop(true)}>
                    Play
                </Butt>
                <Butt selected={!state} onClick={() => setLoop(false)}>
                    Pause
                </Butt>
                <Butt selected={false} onClick={() => setLoop(false, true)}>
                    Step
                </Butt>
            </ButtonGroup>
        </GlobalHotKeys>
    );
}
