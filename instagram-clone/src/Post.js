import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import FavoriteOutlinedIcon from "@material-ui/icons/FavoriteOutlined";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import ShareIcon from "@material-ui/icons/Share";
import InstagramIcon from "@material-ui/icons/Instagram";
import { Button } from "@material-ui/core";
import { db } from "./firebase";


function Post({ postId, user, username, caption, imageUrl }) {
  // Add Coments
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
      event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
    });
    setComment('');
  };

  return (
    <div className="post">
      <div className="post_header">
        <Avatar
          className="post_avatar"
          alt={username}
          // src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
        <InstagramIcon className="like_icon1" />
      </div>
      <img className="post_image" src={imageUrl} />
      <FavoriteOutlinedIcon className="like_icon" color="secondary" />
     
      <ShareIcon className="like_icon" color="black" />
      <h4 className="post_text">
        <strong>{username} </strong>
        {caption}{" "}
      </h4>
      <div className="post_comment">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username} </strong> {comment.text}
          </p>
        ))}
      </div>
      <form className="post_commentBox">
      <ChatBubbleOutlineOutlinedIcon className="like_icon" color="primary" />
        <input
          className="post_input"
          type="text"
          placeholder="Add your Comment ..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          className="postButton"
          type="submit"
          variant="outlined"
          color="primary"
          onChange={postComment}
        >
          Post
        </Button>
      </form>
    </div>
  );
}

export default Post;
