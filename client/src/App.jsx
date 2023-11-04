import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/Authentication/Login";
import SignUp from "./components/Authentication/SignUp";
import About from "./pages/About";
import Chatpage from "./pages/ChatPage";
import Homepage from "./pages/Homepage";

export default function App() {
    return (
        <div  className="App">
            <Routes>
                <Route path="/" element={<Homepage />} />
               

                <Route path="/chats" element={<Chatpage />} />
            </Routes>
        </div>
    );
}
