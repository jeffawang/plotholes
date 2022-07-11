import React, { useState } from "react";
import { ButtonGroup, Button } from "@chakra-ui/react";

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

    return <ButtonGroup size='sm' isAttached variant='outline'>
        <Butt selected={state} onClick={() => {
            sketcher.setLoop(true);
            console.log()
            setState(true);
        }}>Play</Butt>
        <Butt selected={!state} onClick={() => {
            sketcher.setLoop(false);
            setState(false);
        }}>
            Pause
        </Butt>
        <Butt selected={false} onClick={() => {
            sketcher.step();
            setState(false);
        }}>
            Step
        </Butt>
    </ButtonGroup>;
}