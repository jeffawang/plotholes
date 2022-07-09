import { Divider, Heading } from '@chakra-ui/react';
import GroupControlComponent from "./Group";
import RadioControlComponent from "./Radio";
import SliderControlComponent from "./Slider";
import { Uniform, Uniforms } from "./Types";

export function Controls({ uniforms }: {
    uniforms: Uniforms
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
    return <div style={{ "padding": "20px" }}>
        <Heading>{name}</Heading>
        <Divider marginTop="5px" marginBottom="20px" />
        <Controls uniforms={uniforms} />
    </div>;
}

export { ControlsComponent }