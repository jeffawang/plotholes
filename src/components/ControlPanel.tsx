import * as React from "react";
import {
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Divider,
    Flex,
    Heading,
    Spacer,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";

import GroupControl from "./Controls/GroupControl";
import RadioControl from "./Controls/RadioControl";
import SliderControl from "./Controls/SliderControl";
import Checkbox from "./Controls/CheckboxControl";
import NumberControl from "./Controls/NumberControl";
import PlayPauseControl from "./Controls/PlayPauseControl";

import { UniformControls } from "./Controls/UniformControls";
import { Sketcher } from "../sketcher";

export function Controls({ uniforms }: { uniforms: UniformControls }) {
    return (
        <>
            {Object.keys(uniforms).map((name: string) => {
                const uniform = uniforms[name];
                switch (uniform.type) {
                    case "radio":
                        return (
                            <RadioControl
                                name={name}
                                uniform={uniform}
                                key={name}
                            />
                        );
                    case "slider":
                        return (
                            <SliderControl
                                name={name}
                                uniform={uniform}
                                key={name}
                            />
                        );
                    case "group":
                        return (
                            <GroupControl
                                name={name}
                                uniform={uniform}
                                key={name}
                            />
                        );
                    case "checkbox":
                        return (
                            <Checkbox
                                name={name}
                                uniform={uniform}
                                key={name}
                            />
                        );
                    case "number":
                        return (
                            <NumberControl
                                name={name}
                                uniform={uniform}
                                key={name}
                            />
                        );
                    default:
                        console.error("uh oh");
                }
            })}
        </>
    );
}

function SettingsControls<UC extends UniformControls>({
    sketcher,
    settings,
}: {
    sketcher: Sketcher<UC>;
    settings: UniformControls;
}) {
    return (
        <Accordion allowToggle>
            <AccordionItem>
                <Flex direction="row" padding="10px">
                    <PlayPauseControl sketcher={sketcher} />
                    <Spacer />
                    <AccordionButton
                        width={"inherit"}
                        padding={"7px"}
                        borderRadius="50%"
                        border="1px solid"
                        borderColor="gray.200"
                    >
                        <SettingsIcon />
                    </AccordionButton>
                </Flex>
                <AccordionPanel pb={4}>
                    <Controls uniforms={settings} />
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}

function ControlPanel<UC extends UniformControls>({
    sketcher,
    settings,
}: {
    sketcher: Sketcher<UC>;
    settings: UniformControls;
}) {
    return (
        <>
            <Heading>{sketcher.params.title}</Heading>
            <Divider marginTop="5px" marginBottom="20px" />
            <Controls uniforms={sketcher.params.controls} />
            <SettingsControls sketcher={sketcher} settings={settings} />
        </>
    );
}

export { ControlPanel };
