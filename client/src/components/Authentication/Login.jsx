import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";

export default function Login() {
    const toast = useToast();
    const [show, setShow] = useState(false);
    const [data, setData] = useState({
        email: "",

        password: "",
    });
    const { setUser } = ChatState();

    const navigate = useNavigate();
    const handleSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:8888/api/user/login", {
                email: data.email,
                password: data.password,
            });

            toast({
                title: "Login successful",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "bottom",
            });

            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(response.data));
            setTimeout(() => {
                navigate("/chats");
            }, 2000);
        } catch (error) {
            console.log("error==", error.message);
            toast({
                title: "Error Occurred!!!",
                description: error.response.data.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    return (
        <div>
            <VStack spacing="5px" color="black">
                <FormControl id="email" isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        name="email"
                        onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                        placeholder="Enter your Email"
                    />
                </FormControl>
                <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? "text" : "password"}
                            name="password"
                            onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                            placeholder="Enter your Password"
                        />
                        <InputRightElement width="4.rem">
                            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                                {show ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Button colorScheme="blue" width="100%" color="white" onClick={handleSubmit} style={{ marginTop: 15 }}>
                    Login
                </Button>
            </VStack>
        </div>
    );
}
