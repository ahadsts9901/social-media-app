import Home from './components/home/home';
import Signup from './components/signup/signup.jsx';
import Login from './components/login/login.jsx';
import Chat from './components/chat/chat.jsx';
import Search from './components/search/search.jsx';
import Games from './components/games/games.jsx';
import Notifications from './components/notifications/notifications.jsx';
import Create from './components/create/create.jsx';
import Profile from './components/profile/profile.jsx';

import { useEffect, useContext } from 'react';
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { GlobalContext } from "./context/context"

import "./App.css"
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
            } catch (err) {
                console.log(err);
                dispatch({
                    type: "USER_LOGOUT",
                });
            }
        };

        checkLoginStatus();
    }, []);

    return (
        <div className='div'>

            {/* <div>{JSON.stringify(state)}</div> */}
            {/* user routes */}
            {state.isLogin === true && state.role === "user" ? (
                <>
                    <nav>
                        <ul>
                            <li>
                                <Link to={`/`}>Home</Link>
                            </li>
                            <li>
                                <Link to={`/chat`}>Chat</Link>
                            </li>
                            <li>
                                <Link to={`/profile`}>Profile</Link>
                            </li>
                            <li>
                                <Link to={`/search`}>Search</Link>
                            </li>
                            <li>
                                <Link to={`/create`}>Create</Link>
                            </li>
                            <li>
                                <Link to={`/notifications`}>Notifications</Link>
                            </li>
                            <li>
                                <Link to={`/games`}>Games</Link>
                            </li>
                            {state.user.email}
                        </ul>
                    </nav>

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/create" element={<Create />} />
                        <Route path="/notofications" element={<Notifications />} />
                        <Route path="/games" element={<Games />} />
                        <Route path="*" element={<Navigate to="/" replace={true} />} />
                    </Routes>
                </>
            ) : null}

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
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/create" element={<Create />} />
                        <Route path="/notofications" element={<Notifications />} />
                        <Route path="/games" element={<Games />} />
                        <Route path="*" element={<Navigate to="/" replace={true} />} />

                        {/* <Route path="*" element={<Navigate to="/login" replace={true} />} /> */}
                    </Routes>
                </>
            ) : null}
        </div>
    )
}

export default App;
