import React, { lazy, useState, Suspense, useEffect } from "react";
import "./App.css";
import { auth, db } from "./firebase";
import Post from "./Post";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input, useForkRef } from "@material-ui/core";
import ImageUpload from "./ImageUpload";

// import Modal from "@material-ui/core/Modal";
const Modal = lazy(() => import("@material-ui/core/Modal"));

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
    border: "1px solid lightgray",
    // boxShadow: theme.shadows[5],
    boxShadow: "0px 2px 6px rgba(27,27,27,0.12)",
    borderRadius: "5px",
    padding: theme.spacing(2, 4, 3),
    outline: "none",
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // if user has logged in...
        setUser(authUser);
        console.log("use effectin ici");
        console.log(authUser);
      } else {
        // if user has logged out...
        setUser(null);
      }
    });

    return () => {
      // perform some cleanup actions
      console.log("useffect return");
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((r) => {
        setOpenSignIn(false);
      })
      .catch((e) => alert(e.message));
  };

  return (
    <div className="app">
      {open && (
        <Suspense fallback={<div>Loading...</div>}>
          <Modal open={open} onClose={() => setOpen(false)}>
            <div style={modalStyle} className={classes.paper}>
              <center>
                <img
                  className="app__headerImage"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                  alt=""
                />
                <form className="app__signUp">
                  <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <Input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <Button type="submit" onClick={signUp}>
                    Sign Up
                  </Button>
                </form>
              </center>
            </div>
          </Modal>
        </Suspense>
      )}

      {openSignIn && (
        <Suspense fallback={<div>Loading...</div>}>
          <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
            <div style={modalStyle} className={classes.paper}>
              <center>
                <img
                  className="app__headerImage"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
                  alt=""
                />
                <form className="app__signUp">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <Input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <Button type="submit" onClick={signIn}>
                    Sign In
                  </Button>
                </form>
              </center>
            </div>
          </Modal>
        </Suspense>
      )}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1200px-Instagram_logo.svg.png"
          alt=""
        />

        {user ? (
          <Button
            onClick={() => {
              auth.signOut();
            }}
          >
            LogOut
          </Button>
        ) : (
          <div className="ap__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      <div className="app__posts">
        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            imageUrl={post.imageUrl}
            username={post.username}
            user={user}
            caption={post.caption}
          />
        ))}
      </div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName}></ImageUpload>
      ) : (
        <h3>Paylaşmaq üçün Login ol</h3>
      )}
    </div>
  );
}

export default App;
