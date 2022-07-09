import { FormControl, FormHelperText, FormLabel, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { RadioUniform } from "./Types";

export default function RadioControlComponent({ uniform, name }: {
    uniform: RadioUniform
    name: string
}) {
    useEffect(() => {
        // ...
    });

    const onChange = (newSelected: string) => {
        // console.log(newSelected);
    };

    return <FormControl as="fieldset">
        <FormLabel as="legend">{name}</FormLabel>
        <RadioGroup defaultValue={uniform.value} onChange={onChange} children={[]}>
            < Stack spacing="10px" >
                {
                    uniform.options.map((option) =>
                        <Radio
                            defaultChecked={option === uniform.value}
                            value={option}
                            key={option}
                        >
                            {option}
                        </Radio>
                    )
                }
            </Stack>
        </RadioGroup >
        <FormHelperText>{uniform.description}</FormHelperText>
    </FormControl >;
}