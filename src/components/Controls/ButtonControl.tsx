import React from 'react';
import { Button } from '@chakra-ui/react';

import { UniformButton } from './UniformControls';

export default function ButtonControl({
  name,
  uniform,
}: {
  name: string;
  uniform: UniformButton;
}) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={(_u) => {
        if (uniform.onClick) uniform.onClick(uniform);
      }}
    >
      {name}
    </Button>
  );
}
