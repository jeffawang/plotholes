import React from "react";
import { Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Box, FormControl, FormLabel } from "@chakra-ui/react";

import { Controls } from "./Controls";
import { UniformGroup } from "./UniformControls";

export default function GroupControlComponent({ name, uniform }: {
    name: string,
    uniform: UniformGroup
}) {
    return <FormControl as="fieldset">
        <Accordion allowMultiple defaultIndex={uniform.collapsed ? [] : [0]}>
            <AccordionItem>
                <h2>
                    <AccordionButton>
                        <Box flex='1' textAlign='left'>
                            <FormLabel as="legend">{name}</FormLabel>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <Controls uniforms={uniform.value} />
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    </FormControl>;
}