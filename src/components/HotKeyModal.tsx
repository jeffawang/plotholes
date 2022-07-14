import {
    Table,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    TableContainer,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Kbd,
    ModalFooter,
} from '@chakra-ui/react';
import React from 'react';

export default function HotKeyModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
            isCentered
            scrollBehavior="outside"
        >
            <ModalOverlay bg="blackAlpha.500" />
            <ModalContent bg="blackAlpha.900" color="white">
                <ModalHeader>Keyboard Hotkeys</ModalHeader>
                <ModalCloseButton />
                <ModalBody overflow="visible">
                    <TableContainer overflowX="visible">
                        <Table size="sm" variant="unstyled" width="300px">
                            <Thead>
                                <Tr>
                                    <Th>Key</Th>
                                    <Th>Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>
                                        <Kbd color="black">G</Kbd> or{' '}
                                        <Kbd color="black">P</Kbd>
                                    </Td>
                                    <Td>Start or Pause the sketch.</Td>
                                </Tr>
                                <Tr>
                                    <Td>
                                        <Kbd color="black">R</Kbd>
                                    </Td>
                                    <Td wordBreak="break-all">
                                        Redraw the sketch once and pause the
                                        sketch if playing.
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>
                                        <Kbd color="black">S</Kbd>
                                    </Td>
                                    <Td>
                                        Save the currently rendered frame as an
                                        svg.
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>
                                        <Kbd color="black">shift</Kbd> +{' '}
                                        <Kbd color="black">?</Kbd>
                                    </Td>
                                    <Td>Show this keyboard shortcut window.</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </ModalBody>
                <ModalFooter />
            </ModalContent>
        </Modal>
    );
}
