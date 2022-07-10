import * as React from 'react';
import { Divider, Heading } from '@chakra-ui/react';
import GroupControlComponent from "./Group";
import RadioControlComponent from "./Radio";
import SliderControlComponent from "./Slider";
import { UniformControls } from "./Types";
import CheckboxComponent from './Checkbox';
import NumberControlComponent from './Number';

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
                case "checkbox":
                    return <CheckboxComponent name={name} uniform={uniform} />;
                case "number":
                    return <NumberControlComponent name={name} uniform={uniform} />;
                default:
                    console.error("uh oh")
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