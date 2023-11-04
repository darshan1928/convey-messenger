import { SettingsIcon, ViewIcon } from "@chakra-ui/icons";
import {
    Button,
    IconButton,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {FaUser} from "react-icons/fa6"
import { IoMail } from "react-icons/io5";
export default function ProfileModel({ user, children }) {
    const OverlayOne = () => <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [overlay, setOverlay] = useState(<OverlayOne />);
 
    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton d={{ base: "flex" }} icon={<SettingsIcon />} onClick={onOpen} />
            )}
            {/* <Button
                onClick={() => {
                    setOverlay(<OverlayOne />);
                    onOpen();
                }}
            ></Button> */}
            <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
                {overlay}
                <ModalContent h="410px">
                    <ModalHeader fontSize="40px" fontFamily="Work sans" display="flex" justifyContent="center">
                        <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <FaUser size={".8em"} style={{ marginRight: "15px" }} /> {user.name}
                        </span>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
                        <Image borderRadius="full" boxSize="150px" src={user.pic} alt={user.name} />
                        <Text fontFamily="Work sans" fontSize={{ base: "28px", md: "30px" }}>
                            <span style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <IoMail size={"1em"} style={{ marginRight: "15px" }} /> Email : {user.email}
                            </span>
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
