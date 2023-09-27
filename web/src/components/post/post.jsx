import "./post.css";
import "../home/home.css";
import { TrashFill, PencilFill } from 'react-bootstrap-icons';
import moment from 'moment'
import { useState } from "react";

const Post = (props) => {
    const [showFullPost, setShowFullPost] = useState(false)
    const formattedTime = moment(props.time).fromNow();
    const fullText = props.text
    const splittedText = props.text.split(' ').slice(0, 30).join(' ')

    return (
        <div className="post" id="">
            <p className="regards center" style={{ fontSize: '0.7em' }}>{formattedTime}</p>
            <h2 className="scrollH">{props.title}</h2>
            <p className="scroll">{showFullPost ? fullText : splittedText}<span className={`${(splittedText === fullText) ? "hidden" : "show"} see`} onClick={() => { showFullPost ? setShowFullPost(false) : setShowFullPost(true) }} >{showFullPost ? `...see less` : `...see more`}</span></p>
            <div className="space-around">
                <p className="regards">Regards! Muhammad Ahad</p>
                <button onClick={() => { props.del(props.postId) }} className="actionButton"><TrashFill /></button>
                <button onClick={() => { props.edit(props.postId) }} className="actionButton"><PencilFill /></button>
            </div>
        </div>
    );
};


const NoPost = () => {
    return (<h2 className="noPostsMessage">No post found...</h2>)
};

export { Post, NoPost };