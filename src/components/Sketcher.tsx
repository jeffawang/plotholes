import { SettingsIcon } from "@chakra-ui/icons";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Flex, Spacer } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Sketcher } from "../sketcher";
import { Controls, ControlsComponent } from "./ControlPanel";
import { PlayPause } from "./Controls/PlayPause";
import { Plot } from "./Plot";
import { checkbox, slider, UniformCheckbox, UniformControls, UniformNumber, UniformSlider, _number } from "./Controls/UniformControls";
import { GlobalHotKeys } from "react-hotkeys";

function newSettings<UC extends UniformControls>(sketcher: Sketcher<UC>) {
    return {
        autoresize: { type: checkbox, value: true },
        seed: { type: _number, value: sketcher.params.settings.seed || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) },
        framerate: { type: slider, value: sketcher.params.settings.framerate || 60, min: 0, max: 60, step: 0.5 },
    } as UniformControls;
}

export function SketcherComponent<UC extends UniformControls>({ sketcher }: {
    sketcher: Sketcher<UC>
}) {
    const settings = newSettings(sketcher);

    const [plotScale, setPlotScale] = useState(1.0);

    function handleResize() {
        if (!sketcher.params.settings.autoresize) {
            setPlotScale(1.0);
            return;
        }
        const h = sketcher.params.height + 100;
        const wh = window.innerHeight;
        const scale = Math.min(1.0, window.innerHeight / h);
        setPlotScale(scale);
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
    }, []);

    settings.autoresize.onChange = (u: UniformCheckbox) => {
        sketcher.params.settings.autoresize = u.value;
        handleResize();
    }

    settings.seed.onChange = (u: UniformNumber) => sketcher.setSeed(u.value);
    sketcher.setSeed(settings.seed.value as number);

    settings.framerate.onChange = (u: UniformSlider) => sketcher.setFramerate(u.value);
    sketcher.setFramerate(settings.framerate.value as number)

    const keyMap = {
        playpause: ['g', `p`]
    }

    return <GlobalHotKeys keyMap={keyMap}>
        <Box display="flex" alignItems="flex-start" overflow="visible" width="100%">
            <Box flexGrow={"1"}></Box>
            <Box marginTop={"30px"} padding="16px" minWidth="270px">
                <ControlsComponent sketcher={sketcher} />
                <Accordion allowToggle>
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
            </Box>
            <Box
                transform={`scale(${plotScale})`}
                transformOrigin="top left"
                boxShadow={"0px 10px 30px #aaa"}
            >
                <Plot sketcher={sketcher} />
            </Box>
            <Box flexGrow={"1"}></Box>
        </Box >
    </GlobalHotKeys>
}
