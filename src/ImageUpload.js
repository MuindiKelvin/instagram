import React, { useState } from 'react';
import { Button, Input }from '@material-ui/core';
import { storage }  from "./firebase";
import db  from "./firebase";
import firebase from "firebase/compat/app";
import './ImageUpload.css';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function ImageUpload({username}) {
    const [caption, setCaption] = useState("");
    /**const [url, setUrl] = useState(""); */
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };
    const handleUpload = () => {
        if (!image) {
            alert("Please upload an image first!");
        }
 
        const storageRef = ref(storage, `/images/${image.name}`);
 
        // progress can be paused and resumed. It also exposes progress updates.
        // Receives the storage reference and the file to upload.
        const uploadTask = uploadBytesResumable(storageRef, image);
 
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
 
                // update progress
                setProgress(progress);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url  => {
                    // post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                })
                );
            }
        );
    };
    

  return (
    <div className="imageupload"> 
            {/* Caption input */}
            {/*File picker */}
            <progress className="imageupload__progress" value={progress} max="100" />
            <Input type="text" placeholder="Enter a caption..." onChange={event => setCaption(event.target.value)} value={caption}/>
            <Input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
            {/* Post button */}
    </div>

  )
}

export default ImageUpload