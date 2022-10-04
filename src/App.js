import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import db  from "./firebase";
import { Box, Input } from '@material-ui/core';
import { Button, Modal }from '@material-ui/core';
import { auth } from "./firebase";
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed'; 
import { TwitterTimelineEmbed, TwitterShareButton, TwitterTweetEmbed } from "react-twitter-embed";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};
  

function App() {

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState("false");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect (() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // the user has logged in successfully...
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // don't update username..
        } else {
          // if a new user is just created...
          //return authUser.updateProfile({
           // displayName: username,
          //});
        }

      } else {
        // the user has logged out...
        setUser(null);
      }
    })

    return () => {
      // perform some clean up actions and operations..
      unsubscribe();
    }
  }, [user, username]);

  /*useEffect (() => {
    db.collection("posts").onSnapshot(snapshot => (
      setPosts(snapshot.docs.map(doc => (doc.data())
      ))
    ))
 
  }, []); */


  useEffect (() => {
    db.collection("posts").orderBy('timestamp', 'desc').onSnapshot(snapshot => (
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    ))
 
  }, []); 

  /*  */

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
  };

    const signIn = (event) => {
      event.preventDefault();

      auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
      
      setOpenSignIn(false);
    }

     
  return (
    <div className="app">

   
    
      
     {/* Header */}

      <div className="app__header">
        <img className="app__headerImage" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe3fVFpe2OaMdzvjkkj6wE4gFfJTAdWNkJSQ&usqp=CAU" alt=""/>

              {user ? (
                      <Button onClick={() => auth.signOut()}>Log out</Button>
                    ): (
                      <div className="app__loginContainer">
                        <Button onClick={() => setOpenSignIn(true)}>Sign in</Button> 
                        <Button onClick={() => setOpen(true)}>Sign up</Button>          
                    </div>
                      
                    )}

      </div>   
    

      <Modal
            open={open}
            onClose={handleClose}
          >
            <Box sx={style}>

              <form className="app__signup">
                    <center>
                        <img className="app__headerImage" 
                        src="data:image/png;base64,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" 
                        alt=""/>

                        <Input placeholder="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>

                        <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>

                        <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                        <Button type="submit" onClick={signUp}>Sign Up</Button>
                      </center>
              </form>              
             
            </Box>
          </Modal>

          <Modal
            open={openSignIn}
            onClose={() => setOpenSignIn(false)}
          >
            <Box sx={style}>

              <form className="app__signup">
                    <center>
                        <img className="app__headerImage" 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSocQX3qdg1ZKUMyHt_NShkYW5xMKYVpEMVaMgwwO7wIwoV-Kol789jOwCpPSXUU6nzFDk&usqp=CAU" 
                        alt=""/>

                        <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>

                        <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

                        <Button type="submit" onClick={signIn}>Sign In</Button>
                      </center>
              </form>                
             
            </Box>
          </Modal>


      {/* Posts */}

      <div className="app__posts">
        <div className="app__postsLeft">
          {
                posts.map(({id, post}) => (
                  <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
                ))
              }

        </div>
        
        <div className="app__postsRight">
             < InstagramEmbed
                url="https://www.instagram.com/mancity/"
                maxWidth={320}
                hideCaption={false}
                containerTagName='div'
                protocol=''
                injectScript
                onLoading={() => {}}
                onSuccess={() => {}}
                onAfterRender={() => {}}
                onFailure={() => {}}
              /> 

       {/*<TwitterTweetEmbed tweetId={"1577237092580704257"}/>
          
          <TwitterTimelineEmbed 
          sourceType="profile"
          screenName='Mancity'
          options={{height:400}}      
        /> */}
  
        {/* <TwitterShareButton
        url={"https://www.facebook.com/smartprincekevoh"}
        options={{text: "#reactjs is awesome", via: "smartprincekevo"}}         
            /> */}

              
        </div>

           
      </div>   

     

       {/*Image Upload + caption */}

        {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ): (
          <h3>Sorry, try to Login to upload</h3>
        )}
      

      {/* Posts */}
      {/* Posts */}
      {/* Posts */}
     
    </div>
  );
}

export default App;
