import * as React from 'react';
import { Box, Divider, Heading } from '@chakra-ui/react';
import GroupControlComponent from "./Group";
import RadioControlComponent from "./Radio";
import SliderControlComponent from "./Slider";
import { UniformControl, UniformControls } from "./Types";

export function Controls({ uniforms }: {
    uniforms: UniformControls
}) {
    return <>
        {Object.keys(uniforms).map((name: string) => {
            const uniform = uniforms[name];
            switch (uniform.type) {
                case "radio":
                    return <RadioControlComponent name={name} uniform={uniform} />;
                case "slider":
                    return <SliderControlComponent name={name} uniform={uniform} />;
                case "group":
                    return <GroupControlComponent name={name} uniform={uniform} />;
            }
        })}
    </>;
}

function ControlsComponent({ name, uniforms }) {
    return <>
        <Heading>{name}</Heading>
        <Divider marginTop="5px" marginBottom="20px" />
        <Controls uniforms={uniforms} />
    </>;
}

export { ControlsComponent }