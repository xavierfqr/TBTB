import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { storage, firestore, auth } from '../lib/firebase';
import Loader from '../components/Loader';
import toast, {Toaster} from 'react-hot-toast';
import Posts from '../components/Posts';



const LoadingValues = {
    EMPTY : -1,
    LOADING : 0,
    LOADED : 1,
}


function Profile(props) {
    const { id } = useParams();
    const [user] = useAuthState(auth);
    const [title, setTitle] = useState('');
    const [fileURL, setFileURL] = useState(null);
    const [fileValue, setFileValue] = useState('');
    const [posts, setPosts] = useState([]);
    const [uploadingState, setUploadingState] = useState(LoadingValues.EMPTY);
    const [isLoading, setIsLoading] = useState(false);
    const isAdmin = props.location.state.isAdmin;

    const onTitleChange = (e) => {
        const text = e.target.value;
        setTitle(text);
    }

    const onFileChange = async (e) => {
        setFileValue(e.target.value)
        setUploadingState(LoadingValues.LOADING)
        const file = e.target.files[0];
        const storageRef = await storage.ref();
        const fileRef = await storageRef.child(file.name + `$${new Date()}`);
        await fileRef.put(file);
        await setFileURL(await fileRef.getDownloadURL());
        setUploadingState(LoadingValues.LOADED);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {  
            await firestore.collection('users').doc(user.uid).collection('posts').add({
                title,
                audioFile : fileURL,
                createdAt: new Date(),
                heartCount: 0,
                displayName: user.displayName
            })
            toast.success("Post Created !");
        }
        catch(e) {
            toast.error("An error occurred while creating post :(");
        }
        finally {
            setFileValue('')
            await fetchData();
        }
        setUploadingState(LoadingValues.EMPTY);
    }

    async function fetchData() {
        setIsLoading(true);
        const usernameCollection = await firestore.collection('usernames').doc(id).get();
        const userId = (await usernameCollection.data()).user

        const postsCollection = await firestore.collection('users').doc(userId).collection('posts').get();
        setPosts(postsCollection.docs.map(doc => doc.data()));
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <Toaster/>
            {isAdmin &&
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="title" onChange={onTitleChange} value={title}/>
                <input type="file" onChange={onFileChange} value={fileValue}/>
                <button type="submit" disabled={uploadingState !== LoadingValues.LOADED}>Submit</button>
            </form>
            }

            <Loader show={uploadingState === LoadingValues.LOADING}/>

            {isLoading ? 
            <Loader show={isLoading}/>
            : <Posts posts={posts}/>
            }
        </>
    )
}

export default Profile
