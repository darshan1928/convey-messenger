import React, { useEffect } from "react";
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
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
                justifyContent="centerContent"
                bg="#ffff"
                w="100%"
                m="40px"
                borderRadius="lg"
                borderWidth="1px"
                p={3}
            >
                <Text fontSize="4xl" fontFamily="work sans" color="black">
                    Convey
                </Text>
            </Box>

            <Box bg="white" w="100%" p={4} color="black" borderRadius="lg" borderWidth="1px">
                <Tabs variant="soft-rounded">
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
