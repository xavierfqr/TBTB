import React, { useState, useEffect } from 'react';
//import { useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { storage, firestore, auth } from '../lib/firebase';
import ReactAudioPlayer from 'react-audio-player';
import audiomp3 from './song1.mp3';
import Loader from '../components/Loader';
import toast, {Toaster} from 'react-hot-toast';


const LoadingValues = {
    EMPTY : -1,
    LOADING : 0,
    LOADED : 1,
}


function Profile() {
    //const { id } = useParams();
    const [user] = useAuthState(auth);
    const [title, setTitle] = useState('');
    const [fileURL, setFileURL] = useState(null);
    const [posts, setPosts] = useState([]);
    const [uploadingState, setUploadingState] = useState(LoadingValues.EMPTY);
    const [isLoading, setIsLoading] = useState(false);
    
    console.log(fileURL)

    const onTitleChange = (e) => {
        const text = e.target.value;
        setTitle(text);
    }

    const onFileChange = async (e) => {
        setUploadingState(LoadingValues.LOADING)
        console.log("Files : ", e.target.files)
        console.log(new Date());
        const file = e.target.files[0];
        const storageRef = await storage.ref();
        const fileRef = await storageRef.child(file.name + `$${new Date()}`);
        await fileRef.put(file);
        await setFileURL(await fileRef.getDownloadURL());
        setUploadingState(LoadingValues.LOADED);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log("fileURL onSubmit : ", fileURL);
        await firestore.collection('users').doc(user.uid).collection('posts').add({
            title,
            audioFile : fileURL
        })
        await fetchData();
        toast.success("Post Created !");
        setUploadingState(LoadingValues.EMPTY);
    }

    async function fetchData() {
        setIsLoading(true);
        const postsCollection = await firestore.collection('users').doc(user.uid).collection('posts').get();
        setPosts(postsCollection.docs.map(doc => doc.data()));
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <>
            <Toaster/>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="title" onChange={onTitleChange} value={title}/>
                <input type="file" onChange={onFileChange}/>
                <button type="submit" disabled={uploadingState !== LoadingValues.LOADED}>Submit</button>
            </form>
            <Loader show={uploadingState === LoadingValues.LOADING}/>

            {isLoading ? 
            <Loader show={isLoading}/>
            :
            <ul>
                {posts.map((post, index) => {
                    return (<li key={index}>
                            <ReactAudioPlayer
                                controls
                                autoPlay={false}
                                src={post.audioFile}/>
                                {console.log('audioFile', post.audioFile)}
                           <p>{post.title}</p>
                        </li>
                    )
                })}
            </ul>
            }
        </>
    )
}

export default Profile
