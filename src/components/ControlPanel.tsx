import * as React from 'react';
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Divider, Flex, Heading, Spacer } from '@chakra-ui/react';
import GroupControlComponent from "./Controls/Group";
import RadioControlComponent from "./Controls/Radio";
import SliderControlComponent from "./Controls/Slider";
import { UniformControls } from "./Controls/UniformControls";
import CheckboxComponent from './Controls/Checkbox';
import NumberControlComponent from './Controls/Number';
import { Sketcher } from '../sketcher';
import { SettingsIcon } from '@chakra-ui/icons';
import { PlayPause } from './Controls/PlayPause';

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

function GeneralSettingsCluster<UC extends UniformControls>({ sketcher, settings }: {
    sketcher: Sketcher<UC>
    settings: UniformControls
}) {
    return <Accordion allowToggle>
        <AccordionItem>
            <Flex direction="row" padding="10px">
                <PlayPause sketcher={sketcher} />
                <Spacer />
                <AccordionButton width={"inherit"} padding={"7px"} borderRadius="50%" border="1px solid" borderColor="gray.200">
                    <SettingsIcon />
                </AccordionButton>
            </Flex>
            <AccordionPanel pb={4}>
                <Controls uniforms={settings} />
            </AccordionPanel>
        </AccordionItem>
    </Accordion>
}

function ControlPanel<UC extends UniformControls>({ sketcher, settings }: {
    sketcher: Sketcher<UC>
    settings: UniformControls
}) {
    return <>
        <Heading>{sketcher.params.title}</Heading>
        <Divider marginTop="5px" marginBottom="20px" />
        <Controls uniforms={sketcher.params.controls} />
        <GeneralSettingsCluster sketcher={sketcher} settings={settings} />
    </>;
}

export { ControlPanel }