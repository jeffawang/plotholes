import { Box, Spacer } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Sketcher } from "../sketcher";
import { ControlPanel } from "./ControlPanel";
import { Plot } from "./Plot";
import { checkbox, slider, _number, UniformControls, UniformCheckbox, UniformNumber, UniformSlider } from "./Controls/UniformControls";
import { GlobalHotKeys } from "react-hotkeys";
import { Centered } from "./Helpers";

type Settings = {
    autoresize: UniformCheckbox
    seed: UniformNumber
    framerate: UniformSlider
};

export function SketcherComponent<UC extends UniformControls>({ sketcher }: {
    sketcher: Sketcher<UC>
}) {
    const [plotScale, setPlotScale] = useState(1.0);

    function handleResize() {
        if (!sketcher.params.settings.autoresize) {
            setPlotScale(1.0);
            return;
        }
        const canvasHeight = sketcher.params.height;
        // Subtract 60 for margins. Maybe parameterize this in the future.
        const targetHeight = window.innerHeight - 60;
        const scale = Math.min(1.0, targetHeight / canvasHeight);
        setPlotScale(scale);
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const settings: Settings = {
        autoresize: {
            type: checkbox,
            value: true,
            onChange: (u) => {
                sketcher.params.settings.autoresize = u.value;
                handleResize();
            }
        },
        seed: {
            type: _number,
            value: sketcher.params.settings.seed || Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
            onChange: (u) => sketcher.setSeed(u.value)
        },
        framerate: {
            type: slider,
            value: sketcher.params.settings.framerate || 60, min: 0, max: 60, step: 0.5,
            onChange: (u) => sketcher.setFramerate(u.value)
        },
    };

    sketcher.setSeed(settings.seed.value as number);
    sketcher.setFramerate(settings.framerate.value as number);

    const keyMap = {
        playpause: ['g', `p`],
        redraw: 'r'
    }

    return <GlobalHotKeys keyMap={keyMap}>
        <Centered>
            <Box marginTop={"30px"} padding="16px" minWidth="270px">
                <ControlPanel sketcher={sketcher} settings={settings} />
            </Box>
            <Box
                width={sketcher.params.width * plotScale}
                height={sketcher.params.height * plotScale}
                position="relative"
                boxShadow={"0px 10px 30px #aaa"}
            >
                <Box
                    transform={`scale(${plotScale})`}
                    transformOrigin="top left"
                    position="absolute"
                    top="0"
                    left="0"
                >
                    <Plot sketcher={sketcher} />
                </Box>
            </Box>
        </Centered>
    </GlobalHotKeys>
}
