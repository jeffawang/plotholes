import { Box } from "@chakra-ui/react";
import p5 from "p5";
import React, { useRef, useEffect } from "react";
import { Sketcher } from "../sketcher";
import { UniformControls } from "./Types";

export function Plot<UC extends UniformControls>({ sketcher }: {
    sketcher: Sketcher<UC>
}) {
    const elRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        new p5(sketcher.p5Sketch(), elRef.current as HTMLElement);
    }, [])
    return <Box ref={elRef}></Box>
}

