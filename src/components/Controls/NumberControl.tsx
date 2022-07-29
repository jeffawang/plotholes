import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { UniformNumber } from './UniformControls';

export default function NumberControl({
  name,
  uniform,
}: {
  name: string;
  uniform: UniformNumber;
}) {
  const [value, setValue] = useState(uniform.value);

  useEffect(() => {
    uniform.value = value;
    document.dispatchEvent(new Event('controlChanged'));
    if (uniform.onChange !== undefined) uniform.onChange(uniform);
  }, [value]);

  const onChange = (_: string, n: number) => {
    setValue(n);
  };

  return (
    <FormControl as="fieldset">
      <FormLabel as="legend">{name}</FormLabel>
      <NumberInput
        value={value}
        onChange={onChange}
        size="xs"
        textAlign="right"
      >
        <NumberInputField
          paddingLeft="0.3em"
          paddingRight="0.3em"
          textAlign="right"
        />
      </NumberInput>
    </FormControl>
  );
}
