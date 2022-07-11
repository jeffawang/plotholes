import { Checkbox, Stack } from "@chakra-ui/react";
import React from "react";
import { useState } from "react"
import { UniformCheckbox } from "./UniformControls"


export default function CheckboxControl({ name, uniform }: {
    name: string
    uniform: UniformCheckbox
}) {
    const [value, setValue] = useState(uniform.value);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        uniform.value = e.target.checked;
        setValue(e.target.checked);
        if (uniform.onChange !== undefined)
            uniform.onChange(uniform)
    };

    return < Stack spacing="10px" >
        <Checkbox onChange={onChange} isChecked={value} >{name}</Checkbox>
    </Stack>;
}