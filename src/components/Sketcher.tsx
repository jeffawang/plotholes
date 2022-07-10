import { Box } from "@chakra-ui/react";
import React from "react";
import { Sketcher } from "../sketcher";
import { ControlsComponent } from "./Controls";
import { Plot } from "./Plot";
import { UniformControls } from "./Types";

export function SketcherComponent<UC extends UniformControls>({ sketcher }: {
    sketcher: Sketcher<UC>
}) {
    return <Box display="flex">
        <Box marginTop={"30px"} padding="20px" minWidth="270px">
            <ControlsComponent name={sketcher.params.title} uniforms={sketcher.params.controls} />
        </Box>
        <Box>
            <Plot sketcher={sketcher} />
        </Box>
    </Box>
}
