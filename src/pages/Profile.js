import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { storage, firestore, auth } from '../lib/firebase';
import { UserContext } from '../lib/context';
import ReactAudioPlayer from 'react-audio-player';
import audiomp3 from './song1.mp3';


function Profile() {
    //const { id } = useParams();
    const [user] = useAuthState(auth);
    const [title, setTitle] = useState('')
    const [fileURL, setFileURL] = useState(null);
    const [posts, setPosts] = useState([])

    console.log(fileURL)

    const onTitleChange = (e) => {
        const text = e.target.value;
        setTitle(text);
    }

    const onFileChange = async (e) => {
        console.log("Files : ", e.target.files)
        const file = e.target.files[0];
        console.log("1")
        const storageRef = storage.ref();
        console.log("2")
        const fileRef = storageRef.child(file.name);
        console.log("3")
        fileRef.put(file);
        console.log("4")
        setFileURL(await fileRef.getDownloadURL());
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log("fileURL onSubmit : ", fileURL);
        await firestore.collection('users').doc(user.uid).collection('posts').add({
            title,
            audioFile : fileURL
        })
        await fetchData();
    }

    async function fetchData() {
        const postsCollection = await firestore.collection('users').doc(user.uid).collection('posts').get();
        setPosts(postsCollection.docs.map(doc => doc.data()));
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="title" onChange={onTitleChange} value={title}/>
                <input type="file" onChange={onFileChange}/>
                <button type="submit">Submit</button>
            </form>
            <ReactAudioPlayer
                src={audiomp3}
                autoPlay={true}
                controls
            />
            
            <ul>
                {posts.map((post, index) => {
                    return (<li key={index}>
                            
                            <audio
                controls
                src={post.audioFile}>
                    Your browser does not support the
                <code>audio</code> element.
            </audio>
                                {console.log('audioFile', post.audioFile)}
                           <p>{post.title}</p>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default Profile
