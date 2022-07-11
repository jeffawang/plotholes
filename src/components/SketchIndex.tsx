import React from "react";
import { Link } from "react-router-dom";

import { Box, Divider, Heading, Spacer, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

export function SketchIndex({ sketches }) {
    return <Box display="flex" gap="30px">
        <Spacer />
        <Box textAlign="right">
            <Heading marginBottom="10px">plotholes</Heading>
        </Box>
        <Box>
            <Divider orientation="vertical"></Divider>
        </Box>
        <TableContainer>
            <Table variant='unstyled' size="sm" border="1px solid" borderColor={"gray.400"}>
                <Thead>
                    <Tr>
                        <Th>Sketches</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {Object.keys(sketches).map((filename) => {
                        const sketcher = sketches[filename].sketcher;
                        return <Tr _hover={{ background: "gray.100" }} borderTop="0.5px solid" borderColor={"gray.200"} key={filename}>
                            <Td padding="0">
                                <Link to={`/${encodeURIComponent(filename)}`}>
                                    <Box padding="8px 16px">
                                        {sketcher.params.title}
                                    </Box>
                                </Link>
                            </Td>
                        </Tr>
                    })}
                </Tbody>
            </Table>
        </TableContainer>
        <Spacer />
        <Spacer />
    </Box>;
}