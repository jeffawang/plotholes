import { Heading } from '@chakra-ui/react';
import GroupControlComponent from "./Group";
import RadioControlComponent from "./Radio";
import SliderControlComponent from "./Slider";
import { SketchControl, Uniform, Uniforms } from "./Types";

let exampleControls: SketchControl[] = [
    {
        type: "group",
        name: "control group 1",
        children: [
            {
                type: "slider",
                name: "a slider in group 1",
                uniform: "stuff",
                defaultValue: 0.5
            },
            {
                type: "group",
                name: "a nested group",
                children: [
                    {
                        type: "slider",
                        name: "a slider in the nested group",
                        uniform: "stuff",
                        defaultValue: 0.5
                    },
                    {
                        type: "slider",
                        name: "another slider in the nested group",
                        uniform: "stuff2",
                        defaultValue: 0.75
                    },
                ]
            },
        ]
    },
    {
        type: "slider",
        name: "a groupless slider",
        uniform: "stuff2",
        defaultValue: 0.75
    },
    {
        type: "radio",
        name: "a radio button",
        options: [
            {
                name: "option 1",
                value: "option1"
            },
            {
                name: "option 2",
                value: "option2"
            },
            {
                name: "option 3",
                value: "option3"
            },
        ],
        defaultValue: "option1",
        uniform: "omg"
    },
]

function uniformsToControls(uniforms: Uniforms): SketchControl[] {
    return Object.keys(uniforms).map((name) => {
        const u = uniforms[name];
        switch (u.type) {
            case 'slider':
                return {
                    type: "slider",
                    name: name,
                    uniform: name,
                    defaultValue: u.value,
                    step: u.step,
                    min: u.min,
                    max: u.max,
                }
            case 'radio':
                return {
                    type: "radio",
                    name: name,
                    uniform: name,
                    defaultValue: u.value,
                    options: u.options.map((v) => ({ name: v, value: v }))
                }
            case 'group':
                return {
                    type: "group",
                    name: name,
                    children: [] // TODO
                }
        }
    });
}

export function subControl(control: SketchControl) {
    switch (control.type) {
        case "radio":
            return <RadioControlComponent control={control} />;
        case "slider":
            return <SliderControlComponent control={control} />;
        case "group":
            return <GroupControlComponent control={control} />;
    }
}

function ControlsComponent({ name, uniforms }) {
    return <div style={{ "padding": "10px" }}>
        <Heading>{name}</Heading>
        {uniformsToControls(uniforms).map(subControl)}
        {/* {exampleControls.map(subControl)} */}
    </div>;
}

export { ControlsComponent }