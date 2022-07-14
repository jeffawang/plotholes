import React, { useEffect, useState } from 'react';
import { Checkbox, Stack } from '@chakra-ui/react';

import { UniformCheckbox } from './UniformControls';

export default function CheckboxControl({
  name,
  uniform,
}: {
  name: string;
  uniform: UniformCheckbox;
}) {
  const [value, setValue] = useState(uniform.value);

  useEffect(() => {
    uniform.value = value;
    document.dispatchEvent(new Event('controlChanged'));
  }, [value]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    uniform.value = e.target.checked;
    setValue(e.target.checked);
    if (uniform.onChange !== undefined) uniform.onChange(uniform);
  };

  return (
    <Stack spacing="10px">
      <Checkbox onChange={onChange} isChecked={value}>
        {name}
      </Checkbox>
    </Stack>
  );
}
