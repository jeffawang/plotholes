import * as React from 'react';
import { Divider, Heading } from '@chakra-ui/react';
import GroupControlComponent from "./Controls/Group";
import RadioControlComponent from "./Controls/Radio";
import SliderControlComponent from "./Controls/Slider";
import { UniformControls } from "./Controls/UniformControls";
import CheckboxComponent from './Controls/Checkbox';
import NumberControlComponent from './Controls/Number';

export function Controls({ uniforms }: {
    uniforms: UniformControls
}) {
    return <>
        {Object.keys(uniforms).map((name: string) => {
            const uniform = uniforms[name];
            switch (uniform.type) {
                case "radio":
                    return <RadioControlComponent name={name} uniform={uniform} key={name} />;
                case "slider":
                    return <SliderControlComponent name={name} uniform={uniform} key={name} />;
                case "group":
                    return <GroupControlComponent name={name} uniform={uniform} key={name} />;
                case "checkbox":
                    return <CheckboxComponent name={name} uniform={uniform} key={name} />;
                case "number":
                    return <NumberControlComponent name={name} uniform={uniform} key={name} />;
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