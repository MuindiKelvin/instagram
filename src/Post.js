import React, { useState, useEffect} from 'react';
import './Post.css';
import { Avatar } from '@material-ui/core';
import Modal from '@material-ui/core';
import db  from "./firebase";
import firebase from "firebase/compat/app";


function Post( {postId, user, username, caption, imageUrl} ) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
   let unsubscribe;
    if (postId) {
      unsubscribe = db
      .collection("posts")
      .doc(postId).collection("comments")
      .orderBy('timestamp', 'desc')
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
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment("");
  }

  return (
    <div className="post">
      
      <div className="post__header">

        <Avatar 
        className="post__avatar" 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUWunsS1bI6ikhYalT5m68xn0XWMbX8G-m6Q&usqp=CAU" 
        alt="" />
        <h3>{username}</h3>

      </div>
        
        {/*header -> avatar + username */}

        {/* image */}        
        <img className="post__image" 
        src={imageUrl} 
        alt=""/>

        {/* username + caption */}   
        <h4 className="post__text"><strong>{username}</strong>  {caption}</h4>

        <div className="post__comments">
          {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
          ))}

        </div>

        {user && (
              <form className="post__commentBox">
              <input className="post__input" type="text" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)}/>
              <button className="post__button" disabled={!comment} type="submit" onClick={postComment}> Post </button>

              </form>     

        )}

       
        
    </div>
  )
}

export default Post