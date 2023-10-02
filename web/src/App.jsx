import Home from './components/home/home';
import Signup from './components/signup/signup.jsx';
import Login from './components/login/login.jsx';
import Chat from './components/chat/chat.jsx';
import Search from './components/search/search.jsx';
import Games from './components/games/games.jsx';
import Notifications from './components/notifications/notifications.jsx';
import Create from './components/create/create.jsx';
import Profile from './components/profile/profile.jsx';
import Navbar from './components/navbar/navbar'


import { useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { GlobalContext } from "./context/context"

import "./App.css"
import logo from "./components/assets/logoDark.png"
import axios from "axios"

const App = () => {

    const { state, dispatch } = useContext(GlobalContext);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const resp = await axios.get(`/api/v1/profile`, {
                    withCredentials: true,
                });
                dispatch({
                    type: "USER_LOGIN",
                    payload: resp.data.data,
                });
                state.isLogin = true
                state.isAdmin = resp.data.data.isAdmin
            } catch (err) {
                console.log(err);
                dispatch({
                    type: "USER_LOGOUT",
                });
                state.isLogin = false
            }
        };

        checkLoginStatus();
    }, []);

    return (
        <div className='div'>

            {/* <div>{JSON.stringify(state)}</div> */}
            {/* user routes */}
            {state.isLogin === true && state.isAdmin === false ?(
            <>
                <Navbar />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="*" element={<Navigate to="/" replace={true} />} />
                </Routes>
            </>
            ): null } 

            {/* unAuth routes */}
            {state.isLogin === false ? (
                <>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="*" element={<Navigate to="/login" replace={true} />} />
                    </Routes>
                </>
            ) : null}

            {/* splash screen */}
            {state.isLogin === null ? (
                <>
                    <div className='splashCont'>
                        <img src={logo} className='splash'></img>
                        <h1 className='line'><span className='black'>We</span><span> App</span></h1>
                        <p>Make Your Own</p>
                    </div>
                </>
            ) : null}
        </div>
    )
}

export default App;
