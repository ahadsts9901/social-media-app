import Home from './components/home/home';
import Signup from './components/signup/signup.jsx';
import Login from './components/login/login.jsx';
import { Routes, Route, Navigate } from "react-router-dom";


const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
    )
}


export default App;
