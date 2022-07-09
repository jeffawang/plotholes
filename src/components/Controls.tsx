import { Heading } from '@chakra-ui/react';
import GroupControlComponent from "./Group";
import RadioControlComponent from "./Radio";
import SliderControlComponent from "./Slider";
import { Uniform } from "./Types";

export function subControl(name: string, uniform: Uniform) {
    switch (uniform.type) {
        case "radio":
            return <RadioControlComponent name={name} uniform={uniform} />;
        case "slider":
            return <SliderControlComponent name={name} uniform={uniform} />;
        case "group":
            return <GroupControlComponent name={name} uniform={uniform} />;
    }
}

function ControlsComponent({ name, uniforms }) {
    return <div style={{ "padding": "10px" }}>
        <Heading>{name}</Heading>
        {/* Keys are ordered enough in modern ES
         https://stackoverflow.com/questions/60802305/typescript-ordered-dictionary */}
        {Object.keys(uniforms).map((name) => subControl(name, uniforms[name]))}
    </div>;
}

export { ControlsComponent }