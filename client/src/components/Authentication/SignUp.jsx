import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
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
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function SignUp() {
  const [show, setShow] = useState(false);
  const [hide, setHide] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "",
  });
  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
    pic: Yup.mixed().test("fileSize", "File size is too large", (value) => {
      if (!value) return true; // No file selected is valid
      return value.size <= 1048576; // 1MB file size limit
    }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const postDetails = (pics) => {
    setLoading(true);

    if (!pics) {
      toast({
        title: "Please select an image.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

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
        console.log("Cloudinary error:", err);

        if (err.message.includes("file size")) {
          toast({
            title: "File size too large. Please select a smaller image.",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        } else {
          toast({
            title: "An error occurred while uploading the image.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }

        setLoading(false);
      });
  };
  
  const submitHandler = async (formData) => {

    

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
          name: formData.name,
          email: formData.email,
          password: formData.password,
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
      localStorage.setItem("userInfo", JSON.stringify(response.data));

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
      <form onSubmit={handleSubmit(submitHandler)}>
    <VStack spacing="5px" color="black">
        <FormControl id="first-name" >
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            {...register("name")}
            placeholder="Enter your Name"
          />
         <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.2rem' }}>
        {errors.name &&  `*${errors.name?.message}`}
      </p>
        </FormControl>
        <FormControl id="email" >
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            {...register("email")}
            placeholder="eg : abc@example.com"
          />
          <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.2rem' }}>
        {errors.email &&  `*${errors.email?.message}`}
      </p>
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              name="password"
              {...register("password")}
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
        <FormControl id="confirmPassword" >
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={hide ? "text" : "password"}
              name="confirmPassword"
              {...register("confirmPassword")}
              placeholder="Repeat Password"
            />
            <InputRightElement width="4.rem">
              <Button h="1.75rem" size="sm" onClick={() => setHide(!hide)}>
                {hide ? (
                  <AiFillEyeInvisible style={{ fontSize: "20px" }} />
                ) : (
                  <AiFillEye style={{ fontSize: "20px" }} />
                )}
              </Button>
            </InputRightElement>
          </InputGroup>
          <p style={{ color: 'red', fontSize: '0.85rem', marginTop: '0.2rem' }}>
        {errors.confirmPassword && `*${errors.confirmPassword?.message}`}
      </p>
        </FormControl>
        <FormControl id="pic">
          <FormLabel>Upload Your Picture</FormLabel>
          <InputGroup>
            <Input
              type="file"
              p={1.5}
              accept="image/**"
              name="pic"
              onChange={(e) => postDetails(e.target.files[0])}
              placeholder="Upload your Image"
            />
          </InputGroup>
        
        </FormControl>
        <Button
          bg="black"
          borderRadius="full"
          width="100%"
          color="white"
          style={{ marginTop: 15 }}
          isLoading={loading}
          type="submit"
        >
          SIGN UP
        </Button>
    </VStack>
      </form>
  );
}
