import React, { useEffect } from "react";
import { Box, Container, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import SignUp from "../components/Authentication/SignUp";
import Login from "../components/Authentication/Login";
import { useNavigate } from "react-router-dom";
export default function Homepage() {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if (user) {
            navigate("/chats");
        }
    }, [navigate]);

    return (
        <Container maxW="xl" centerContent>
            <Box
                display="flex"
                justifyContent="center"
                bg="#ffff"
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
                p={3}
            >
                <Image
                    objectFit="cover"
                    boxSize="30px"
                    width="120px"
                    src="../../public/convey-logo.png"
                    alt="Convey logo"
                />
                {/* <Text fontSize="4xl" fontFamily="work sans" color="black">
                    CONVEY
                </Text> */}
            </Box>

            <Box bg={"#fff"} w="100%" p={4} color="black" borderRadius="lg" borderWidth="1px">
                <Tabs colorScheme="blackAlpha" variant="soft-rounded">
                    <TabList mb="1em">
                        <Tab w="50%">LOGIN</Tab>
                        <Tab w="50%">SIGN UP</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
}
