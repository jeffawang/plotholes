import { Box, Spacer } from '@chakra-ui/react';
import React from 'react';

export function Centered({ children }: React.PropsWithChildren) {
    return (
        <Box
            display="flex"
            alignItems="flex-start"
            overflow="visible"
            width="100%"
        >
            <Spacer />
            {children}
            <Spacer />
        </Box>
    );
}
