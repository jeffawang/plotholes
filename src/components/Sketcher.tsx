import { Box } from "@chakra-ui/react";
import React from "react";
import { Sketcher } from "../sketcher";
import { Controls, ControlsComponent } from "./Controls";
import { Plot } from "./Plot";
import { checkbox, group, UniformCheckbox, UniformControls, _number } from "./Types";

function newSettings<UC extends UniformControls>(sketcher: Sketcher<UC>) {
    const settings: UniformControls = {
        loop: { type: checkbox, value: false },
        autoresize: { type: checkbox, value: true },
        seed: { type: _number, value: 1 }
    };
    return {
        settings: {
            type: group, value: settings
        },
    };
}

export function SketcherComponent<UC extends UniformControls>({ sketcher }: {
    sketcher: Sketcher<UC>
}) {

    const settings = newSettings(sketcher);
    const settingsUniforms = settings.settings.value;

    settingsUniforms.loop.onChange = (u: UniformCheckbox) => {
        sketcher.setLoop(u.value);
    };

    return <Box display="flex">
        <Box marginTop={"30px"} padding="20px" minWidth="270px">
            <ControlsComponent name={sketcher.params.title} uniforms={sketcher.params.controls} />
            <Controls uniforms={settings} />
        </Box>
        <Box>
            <Plot sketcher={sketcher} />
        </Box>
    </Box>
}
