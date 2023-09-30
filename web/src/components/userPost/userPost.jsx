import "./userPost.css";
// import { TrashFill, PencilFill } from 'react-bootstrap-icons';
import moment from 'moment'
import { useState } from "react";
import profileImg from "../assets/profileImg.webp"

const UserPost = (props) => {
    const [showFullPost, setShowFullPost] = useState(false)
    const formattedTime = moment(props.time).fromNow();
    const fullText = props.text
    const splittedText = props.text.split(' ').slice(0, 60).join(' ')

    return (

        <div className="singlePost">
            <div className="postHead">
                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
                <div className="postNames">
                    <h2 >{props.title}</h2>
                    <p>{formattedTime}</p>
                </div>
            </div>
            <div className="textContainer">
                <p className={`${(fullText.length <= 40) ? "bigText" : "smallText"}`}>
                    {showFullPost ? fullText : splittedText}
                    <span className={`${(splittedText === fullText) ? "hidden" : "show"} see`} onClick={!showFullPost} >
                        {showFullPost ? `...see less` : `...see more`}</span></p>
            </div>
            <div className="buttonContainer">
                <button><i className="bi bi-hand-thumbs-up"></i>Like</button>
                <button><i className="bi bi-chat-square"></i>Comment</button>
                <button><i className="bi bi-share-fill"></i>Share</button>
            </div>
            <div className="buttonContainer">
                <button className="editDelBtns" onClick={() => { props.edit(props.postId) }} ><i className="bi bi-pencil-fill"></i>Edit</button>
                <button className="editDelBtns" onClick={() => { props.del(props.postId) }} ><i className="bi bi-trash-fill"></i>Delete</button>
            </div>
        </div>

    );
};


const NoPost = () => {
    return (<h2 className="noPostsMessage">No post found...</h2>)
};

export { UserPost, NoPost };