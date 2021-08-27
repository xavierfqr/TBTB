import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { storage, firestore, auth } from '../lib/firebase';
import Loader from '../components/Loader';
import toast, {Toaster} from 'react-hot-toast';
import Posts from '../components/Posts';
import styles from './Profile.module.css';
import AddCircleIcon from '@material-ui/icons/AddCircle';


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
        setTitle('');
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

    const hiddenFileInput = useRef(null);

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div className={styles.content}>
            <Toaster/>
            <div className={styles.formWrapper}>
                {isAdmin &&
                <form className={styles.form} onSubmit={onSubmit}>
                    <input className={styles.formTitle} type="text" placeholder="Title" onChange={onTitleChange} value={title}/>
                    <input className={styles.file} type="file" onChange={onFileChange} value={fileValue} ref={hiddenFileInput}/>
                    <div className={styles.addIcon} onClick={e => {hiddenFileInput.current.click()}}>
                        <AddCircleIcon fontSize="large"/>
                    </div>
                    {uploadingState !== LoadingValues.LOADING ?
                        <button type="submit" disabled={uploadingState !== LoadingValues.LOADED} className={uploadingState !== LoadingValues.LOADED ? styles.noCursor : styles.button}><h3>Submit</h3></button>
                        :<div className={styles.loader}><Loader show={uploadingState === LoadingValues.LOADING}/></div>
                    }
                </form>
                }
            </div>
            <main>
                {isLoading ? 
                <Loader show={isLoading}/>
                : <Posts posts={posts}/>
                }
            </main>
        </div>
    )
}

export default Profile
