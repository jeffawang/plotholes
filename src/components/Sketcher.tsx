import { SettingsIcon } from "@chakra-ui/icons";
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Button, ButtonGroup, Flex, IconButton, Spacer, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Sketcher } from "../sketcher";
import { Controls, ControlsComponent } from "./Controls";
import { PlayPause } from "./PlayPause";
import { Plot } from "./Plot";
import { checkbox, group, slider, UniformCheckbox, UniformControls, UniformNumber, UniformSlider, _number } from "./UniformControls";

function newSettings<UC extends UniformControls>(sketcher: Sketcher<UC>) {
    const settings: UniformControls = {
        autoresize: { type: checkbox, value: true },
        seed: { type: _number, value: sketcher.params.settings.seed || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) },
        framerate: { type: slider, value: sketcher.params.settings.framerate || 60, min: 0, max: 60, step: 0.5 },
    };
    return {
        settings: {
            type: group, value: settings, collapsed: true
        },
    };
}

export function SketcherComponent<UC extends UniformControls>({ sketcher }: {
    sketcher: Sketcher<UC>
}) {
    const settings = newSettings(sketcher);
    const settingsUniforms = settings.settings.value;

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

        // Prevent spacebar from doing pagedown.
        window.onkeydown = function (event) {
            if (event.keyCode === 32)
                event.preventDefault();
        };
    }, []);

    settingsUniforms.autoresize.onChange = (u: UniformCheckbox) => {
        sketcher.params.settings.autoresize = u.value;
        handleResize();
    }

    settingsUniforms.seed.onChange = (u: UniformNumber) => sketcher.setSeed(u.value);
    sketcher.setSeed(settingsUniforms.seed.value as number);

    settingsUniforms.framerate.onChange = (u: UniformSlider) => sketcher.setFramerate(u.value);
    sketcher.setFramerate(settingsUniforms.framerate.value as number)


    return <Box display="flex" alignItems="flex-start" overflow="visible" width="100%">
        <Box flexGrow={"1"}></Box>
        <Box marginTop={"30px"} padding="20px" minWidth="270px">
            <ControlsComponent name={sketcher.params.title} uniforms={sketcher.params.controls} />
            <Accordion allowToggle>
                <AccordionItem>
                    <Flex direction="row" padding="10px">
                        <PlayPause sketcher={sketcher} />
                        <Spacer />
                        <AccordionButton width={"inherit"} padding={"8px"} borderRadius="50%">
                            <SettingsIcon />
                        </AccordionButton>
                    </Flex>
                    <AccordionPanel pb={4}>
                        <Controls uniforms={settings.settings.value} />
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
}
