import { Heading } from '@chakra-ui/react';
import GroupControlComponent from "./Group";
import RadioControlComponent from "./Radio";
import SliderControlComponent from "./Slider";
import { SketchControl } from "./Types";

let exampleControls: SketchControl[] = [
    {
        type: "group",
        name: "control group 1",
        children: [
            {
                type: "slider",
                name: "a slider in group 1",
                field: "stuff",
                defaultValue: 0.5
            },
            {
                type: "group",
                name: "a nested group",
                children: [
                    {
                        type: "slider",
                        name: "a slider in the nested group",
                        field: "stuff",
                        defaultValue: 0.5
                    },
                    {
                        type: "slider",
                        name: "another slider in the nested group",
                        field: "stuff2",
                        defaultValue: 0.75
                    },
                ]
            },
        ]
    },
    {
        type: "slider",
        name: "a groupless slider",
        field: "stuff2",
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
        field: "omg"
    },
]

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

function ControlsComponent({ name }) {
    return <div style={{ "padding": "10px" }}>
        <Heading>{name}</Heading>
        {exampleControls.map(subControl)}
    </div>;
}

export { ControlsComponent }