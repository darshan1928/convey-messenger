import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function SignUp() {
    const [show, setShow] = useState(false);
    const [hide, setHide] = useState(false);
    const [data, setData] = useState({
        email: "",
        name: "",
        confirmPassword: "",
        password: "",
        pic: "",
    });
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const postDetails = (pics) => {
        setLoading(true);
        if (pics == undefined) {
            toast({
                title: "Please Select an Image!!!!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const datas = new FormData();

            datas.append("file", pics);
            datas.append("upload_preset", "convey-chat");
            datas.append("cloud_name", "dig7xmhcv");
            fetch("https://api.cloudinary.com/v1_1/dig7xmhcv/image/upload", {
                method: "post",
                body: datas,
            })
                .then((res) => res.json())
                .then((details) => {
                    setData({ ...data, pic: details.url.toString() });

                    setLoading(false);
                })
                .catch((err) => {
                    console.log("err==", err.message);
                    setLoading(false);
                });
        } else {
            toast({
                title: "Please Select an Image!!!!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
    };
    const submitHandler = async () => {
        setLoading(true);
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:8888/",
            },
        };
        try {
            const response = await axios.post(
                "http://localhost:8888/api/user",
                {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    pic: data.pic,
                },
                config
            );

            toast({
                title: "Register Successfully!!!",
                description: "Successful...!!!",
                status: "success",
                duration: 2000,
                isClosable: true,
                position: "bottom",
            });
            localStorage.setItem("userInfo", JSON.stringify(response));
            console.log(response.token);
            console.log(response);
            setLoading(false);
           
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
            setLoading(false);
        }
    };

    return (
        <VStack spacing="5px" color="black">
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    name="name"
                    onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                    placeholder="Enter your Name"
                />
            </FormControl>
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
            <FormControl id="confirmPassword" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input
                        type={hide ? "text" : "password"}
                        name="confirmPassword"
                        onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                        placeholder="Repeat Password"
                    />
                    <InputRightElement width="4.rem">
                        <Button h="1.75rem" size="sm" onClick={() => setHide(!hide)}>
                            {hide ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic" isRequired>
                <FormLabel>Upload Your Picture</FormLabel>
                <InputGroup>
                    <Input
                        type="file"
                        p={1.5}
                        accept="image/**"
                        name="confirmPassword"
                        onChange={(e) => postDetails(e.target.files[0])}
                        placeholder="Repeat Password"
                    />
                </InputGroup>
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                color="white"
                style={{ marginTop: 15 }}
                isLoading={loading}
                onClick={submitHandler}
            >
                Sign Up
            </Button>
        </VStack>
    );
}
