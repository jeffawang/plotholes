import { useState, useEffect } from 'react';
import { Text, Box, NumberInput, NumberInputField, FormControl, FormLabel } from '@chakra-ui/react'
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react'

import { SliderControl } from "./Types";

export default function SliderControlComponent({ control }: {
    control: SliderControl
}) {
    const [value, setValue] = useState(control.defaultValue);

    useEffect(() => {
        // uniforms.current[control.uniform] = { type: "f", value: value }
    });

    const onChange = (n: number) => {
        setValue(n);
        // uniforms.current[control.uniform].value = value;
    };
    const onChangeWithString = (_: string, n: number) => { onChange(n) };

    const step = control.step === undefined ? 0.01 : control.step;
    const min = control.min === undefined ? 0 : control.min;
    const max = control.max === undefined ? 1 : control.max;

    return <FormControl as="fieldset" >
        <FormLabel as="legend">{control.name}</FormLabel>
        <Box display="flex" style={{ gap: 20 }}>
            <NumberInput value={value} onChange={onChangeWithString} size="xs" textAlign="right" max={1} min={0} maxW="3rem">
                <NumberInputField paddingLeft="0.3em" paddingRight="0.3em" textAlign="right" />
            </NumberInput>
            <Slider step={step} onChange={onChange} focusThumbOnChange={false}
                min={min}
                max={max}
                aria-label={`slider-${control.uniform}`}
                value={value}>
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
        </Box>
    </FormControl >;
}