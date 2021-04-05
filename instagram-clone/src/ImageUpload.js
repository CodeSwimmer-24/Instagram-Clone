import React, { useState } from "react";
import { Button } from "@material-ui/core";
import firebase from "firebase";
import { storage, db } from "./firebase";
import './ImageUpload.css';

function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image); //Download the images
    uploadTask.on(
      "state_change",
      (snapshot) => {
        //progress Function...
        const progress = Math.round(
          //All this codes is for progress bar to show how much time is take to upload the image or file
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        // to store the image or file in the firebase storage
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              //posting the images in the data base
              timestamp: firebase.firestore.FieldValue.serverTimestamp(), //it shows the timing of the posts that in which time the post has been posted
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption(""); //these three thingts we set to null because after uploading that
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <progress className="imageUploas_progress" value={progress} max="100" />
      <input
      className="input_caption"
        type="text"
        placeholder="Enter a Caption..."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <br />
      <label htmlFor="upload-photo">
  <input
    style={{ display: 'none' }}
    id="upload-photo"
    className="upload-photo"
    type="file"
    onChange={handleChange}
  />

  <Button color="secondary" variant="contained" component="span">
    Upload button
  </Button>
</label>;
      <Button  variant="contained" color="primary" onClick={handleUpload}>Upload</Button>
    </div>
  );
}

export default ImageUpload;
