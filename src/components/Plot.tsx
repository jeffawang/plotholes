import { Box } from "@chakra-ui/react";
import p5 from "p5";
import React, { useRef, useEffect, useState } from "react";
import { Sketcher } from "../sketcher";
import { UniformControls } from "./Controls/UniformControls";

export function Plot<UC extends UniformControls>({ sketcher }: {
    sketcher: Sketcher<UC>
}) {
    const elRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        new p5(sketcher.p5Sketch(), elRef.current!);
    }, []);

    return <Box ref={elRef} />;
}

