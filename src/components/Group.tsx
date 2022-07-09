import { Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Box } from "@chakra-ui/react";
import { subControl } from "./Controls";
import SliderControlComponent from "./Slider";
import { GroupControl, SketchControl, SliderControl } from "./Types";

export default function GroupControlComponent({ control }: {
    control: GroupControl
}) {
    return <Accordion allowMultiple defaultIndex={[0]}>
        <AccordionItem>
            <h2>
                <AccordionButton>
                    <Box flex='1' textAlign='left'>
                        {control.name}
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
                {control.children.map(subControl)}
            </AccordionPanel>
        </AccordionItem>
    </Accordion>
}

