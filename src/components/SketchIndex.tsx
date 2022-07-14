import React from "react";
import { Link } from "react-router-dom";

import {
    Box,
    Divider,
    Heading,
    Spacer,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { Sketcher } from "../sketcher";
import { UniformControls } from "./controls/UniformControls";

export function SketchIndex<UC extends UniformControls>({
    sketches,
}: {
    // Note(jw): The filename keys come from the parcel glob import syntax, and
    //           `sketcher` comes from a standard in this project.
    [filename: string]: {
        sketcher: Sketcher<UC>;
    };
}) {
    console.log(sketches);

    const SketchTable = () => (
        <TableContainer>
            <Table
                variant="unstyled"
                size="sm"
                border="1px solid"
                borderColor={"gray.400"}
            >
                <Thead>
                    <Tr>
                        <Th>Sketches</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {Object.keys(sketches).map((filename) => {
                        const sketcher = sketches[filename].sketcher;
                        return (
                            <Tr
                                _hover={{ background: "gray.100" }}
                                borderTop="0.5px solid"
                                borderColor={"gray.200"}
                                key={filename}
                            >
                                <Td padding="0">
                                    <Link
                                        to={`/${encodeURIComponent(filename)}`}
                                    >
                                        <Box padding="8px 16px">
                                            {sketcher.params.title}
                                        </Box>
                                    </Link>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );

    return (
        <Box display="flex" gap="30px">
            <Spacer />
            <Heading marginBottom="10px">plotholes</Heading>
            <Box>
                <Divider orientation="vertical"></Divider>
            </Box>
            <SketchTable />
            <Spacer />
            <Spacer />
        </Box>
    );
}
