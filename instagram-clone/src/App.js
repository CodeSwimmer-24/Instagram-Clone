import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from 'react-instagram-embed';
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => {
      // perform some clean up actions
      unsubscribe();
    };
  }, [user, username]); //backend listener

  // useEffect -> Run a peace of code based on some specific conditions

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapShot) => {
        setPosts(
          snapShot.docs.map((doc) => ({
            id: doc.id, //id: takes the unique id from firebase
            post: doc.data(), // doc : takes all the data from the unique id which is user name and caption and image url
          }))
        );
      }); // snapShot help us that what ever we add in fire base it autometically added to the AppJs
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      }) //it is a inbuild code which directiy check or aunticate the email id and user
      .catch((error) => alert(error.message));
  };
  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };
  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app_headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
              />

            </center>
            <Input
              placeholder="User Name"
              type="teaxt"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={signUp}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app_headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={signUp}
            >
              LogIn
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
        />
        {user ? (
          <Button variant="contained" onClick={() => auth.signOut()}>Log OUt</Button>
        ) : (
          <div classNmae="app_loginContainer">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenSignIn(true)}
            >
              Log In
            </Button>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
        <div className="app_post">
        {posts.map((
        { id, post } //By putting id here it only put the new post but not refresh the old post
      ) => (
        <Post
          key={id}
          postId={id}
          user={user}//comment user name
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />

      ))}
      
        <InstagramEmbed
          url='https://www.instagram.com/p/Zw9o4/'
          clientAccessToken='123|456'
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
        </div>
     
      {user?.displayName ? (
        //{user.?->optional , its says that is displayName is not there dont show error keep calm} //it help to uploas the image when the user is loged in then only otherwise it shows that sorry login to upload
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry Login to Upload </h3>
      )}
    </div>
  );
}
export default App;
