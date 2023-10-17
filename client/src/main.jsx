import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import ChatProvider from "./context/ChatProvider.jsx";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
    <ChakraProvider>
        <Router>
            <ChatProvider>
                <App />
            </ChatProvider>
        </Router>
    </ChakraProvider>
);
