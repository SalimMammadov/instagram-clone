import { Avatar } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import "./Post.css";
import firebase from "firebase";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

function Post({ imageUrl, caption, user, username, postId }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const postComment = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>
      <LazyLoadImage
        effect="blur"
        className="post__image"
        src={imageUrl}
        placeholderSrc={
          process.env.PUBLIC_URL + "/5922208e18658f5e83b6ad801b895f71.gif"
        }
        alt=""
      />
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="comment__box">
          <input
            type="text"
            className="post__input"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment}
            type="submit"
            onClick={postComment}
            className="post__button"
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
