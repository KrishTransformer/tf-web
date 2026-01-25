import React from "react";
import "./../node_modules/bootstrap/dist/js/bootstrap.bundle";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./../node_modules/jquery/dist/jquery.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./page/home/Home.js";
import TwoWinding from "./page/twoWinding/TwoWinding";
import Fabrication from "./page/fabrication/Fabrication.js";
// import PrivateRoutes from "./components/privateRoute/PrivateRoute.js";
import Login from "./components/signin/Signin.js";
import RequestOtp from "./components/sendOtp/index.js";
import SignUp from "./components/signup/Signup.js";
import CoreModel from "./page/coreModel/CoreModel.js";
import ObjMtlViewer from "./components/objMtlViewer/ObjMtlViewer.js";
import Files from "./page/files/Files.js";
import MyGlbViewer from "./components/glbViewer/MyGlbViewer.js";
import SocketChat from "./page/other/SocketChat.js";
import Profile from "./page/profile/profile.js";
import Users from "./page/users/users.js";
import LomCost from "./page/lomCost/lomCost.js";
function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/forgotPassword" element={<RequestOtp />} />
        {/* <Route element={<PrivateRoutes />}> */}
        <Route path="/home" element={<Home />} />
        <Route path="/2windings/:id" element={<TwoWinding />} />
        <Route path="/fabrication/:id" element={<Fabrication />} />
        <Route path="/files/:id" element={<Files />} />
        <Route path="*" element={<Home />} />
        <Route path="/core/:id" element={<CoreModel />} />
        <Route path="/socket" element={<SocketChat />} />
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/users" element={<Users/>}/>
        <Route path="/lomCost" element={<LomCost/>}/>
      </Routes>
    </Router>

  );
}

export default App;
