import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';

import { UniformRadio } from './UniformControls';

export default function RadioControl({
  uniform,
  name,
}: {
  uniform: UniformRadio;
  name: string;
}) {
  const [value, setValue] = useState(uniform.value);

  useEffect(() => {
    uniform.value = value;
    document.dispatchEvent(new Event('controlChanged'));
  }, [value]);

  const onChange = (newSelected: string) => {
    uniform.value = newSelected;
    if (uniform.onChange !== undefined) uniform.onChange(uniform);
    setValue(newSelected);
  };

  return (
    <FormControl as="fieldset">
      <FormLabel as="legend">{name}</FormLabel>
      <RadioGroup defaultValue={value} onChange={onChange}>
        <Stack spacing="10px">
          {uniform.options.map((option) => (
            <Radio
              defaultChecked={option === value}
              value={option}
              key={option}
            >
              {option}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
      <FormHelperText>{uniform.description}</FormHelperText>
    </FormControl>
  );
}
