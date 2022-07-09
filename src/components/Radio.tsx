import { FormControl, FormHelperText, FormLabel, HStack, Radio, RadioGroup } from '@chakra-ui/react';
import { useEffect } from 'react';
import { RadioControl } from "./Types";

export default function RadioControlComponent({ control }: {
    control: RadioControl
}) {
    useEffect(() => {
        // ...
    });

    const onChange = (newSelected: string) => {
        console.log(newSelected);
    };

    return <FormControl as="fieldset">
        <FormLabel as="legend">{control.name}</FormLabel>
        <RadioGroup defaultValue={control.defaultValue} onChange={onChange}>
            <HStack spacing="24px">
                {control.options.map((option) =>
                    <Radio
                        defaultChecked={option.value === control.defaultValue}
                        value={option.value}
                        key={option.value}
                    >
                        {option.name}
                    </Radio>
                )}
            </HStack>
        </RadioGroup>
        <FormHelperText>{control.description}</FormHelperText>
    </FormControl>;
}