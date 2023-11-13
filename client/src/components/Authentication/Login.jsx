import React, { useState } from "react";
import {
  Button,
  FormControl,

  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Login() {
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8).max(32).required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const toast = useToast();
  const [show, setShow] = useState(false);
  //   const [data, setData] = useState({
  //     email: "",

  //     password: "",
  //   });
  const { setUser } = ChatState();

  const navigate = useNavigate();
  const onSubmitHandler = async (data) => {
    console.log({ data });

    try {
      const response = await axios.post(
        "http://localhost:8888/api/user/login",
        {
          email: data.email,
          password: data.password,
        }
      );

      toast({
        title: "Login successful",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });

      setUser(response.data);

      localStorage.setItem("userInfo", JSON.stringify(response.data));
      reset();
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
 
        <form onSubmit={handleSubmit(onSubmitHandler)}>
      <VStack spacing="5px" color="black">
          <FormControl id="email" >
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              {...register("email")}
              // onChange={(e) =>
              //   setData({ ...data, [e.target.name]: e.target.value })
              // }
              placeholder="eg : abc@example.com"
            />
           <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.2rem' }}>
        {errors.email &&  `*${errors.email?.message}`}
      </p>
          </FormControl>
          <FormControl id="password" >
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={show ? "text" : "password"}
                name="password"
                {...register("password")}
                //   onChange={(e) =>
                //     setData({ ...data, [e.target.name]: e.target.value })
                //   }
                placeholder="Enter your Password"
              />
              
            
              <InputRightElement width="4.rem">
                <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                  {show ? (
                    <AiFillEyeInvisible style={{ fontSize: "20px" }} />
                  ) : (
                    <AiFillEye style={{ fontSize: "20px" }} />
                  )}
                </Button>
              </InputRightElement>
             
            </InputGroup>
            <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.2rem' }}>
        {errors.password && `*${errors.password?.message}`}
      </p>
          </FormControl>

          <Button
            bg="black"
            borderRadius="full"
            width="100%"
            color="white"
            type="submit"
            style={{ marginTop: 15 }}
          >
            LOGIN
          </Button>
      </VStack>
        </form>
    
  );
}
