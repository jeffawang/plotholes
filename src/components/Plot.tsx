import { Box } from "@chakra-ui/react";
import p5 from "p5";
import React, { useRef, useEffect, useState } from "react";
import { Sketcher } from "../sketcher";
import { UniformControls } from "./Types";

export function Plot<UC extends UniformControls>({ sketcher }: {
    sketcher: Sketcher<UC>
}) {
    const elRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1.0);

    useEffect(() => {
        new p5(sketcher.p5Sketch(), elRef.current!);

        function handleResize() {
            const h = sketcher.params.height + 100;
            const wh = window.innerHeight;
            const scale = Math.min(1.0, window.innerHeight / h);
            setScale(scale);
        }
        window.addEventListener('resize', handleResize);
        handleResize();
    }, []);

    return <Box
        transformOrigin="top left"
        transform={`scale(${scale})`}
        boxShadow={"0px 10px 30px #aaa"}
        ref={elRef} />;
}

