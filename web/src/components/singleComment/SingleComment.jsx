import React, { useState } from 'react'
import "./SingleComment.css"
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const SingleComment = (props) => {

    const [showFullComment, setShowFullComment] = useState(false)
    const formattedTime = moment(props.time).fromNow();
    const fullComment = props.comment;
    const splittedComment = props.comment.split(" ").slice(0, 20).join(" ");

    const navigate = useNavigate()

    const toggleShowFullComment = () => {
        setShowFullComment(!showFullComment);
    };

    return (
        <div className='singleComment'>
            <div className="singleCommentHead" onClick={() => { navigate(`/profile/${props.userId}`) }}>
                <img src={props.image} alt="image" />
                <p>{props.userName}</p>
                <span>{formattedTime}</span>
            </div>
            <div className="commentTextContainer" >
                <p className="commentText">
                    <span >{showFullComment ? fullComment : splittedComment}</span>
                    {splittedComment !== fullComment && (
                        <span className="see" onClick={toggleShowFullComment}>
                            {showFullComment ? "...see less" : "...see more"}
                        </span>
                    )}
                </p>
            </div>
        </div>
    )
}

export default SingleComment