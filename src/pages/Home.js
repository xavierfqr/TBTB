import React from 'react';
import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { useHistory, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import styles from './Home.module.css';

function Home() {
    const [user] = useAuthState(auth);

    return (
        <main>
            {!user ? (
                <div className={styles.card}>
                    <h1>Sign in with Google</h1>
                    <SignInButton/>
                </div>
            ) : <Link to="/feed">Access to your feed</Link>}
        </main>
    )
}

const SignInButton = () => {
    const history = useHistory();

    const signInWithGoogle = async () => {
        const res = await auth.signInWithPopup(googleAuthProvider);
        const user = res.user;
        await firestore.collection('users').doc(user.uid).set({
            displayName : user.displayName,
            photoURL : user.photoURL,
        }, {merge: true});
        await firestore.collection('users').doc(user.uid).collection("posts").doc();
        await firestore.collection('usernames').doc(user.displayName).set({
            user : user.uid
        })

        history.push("/feed");
    }

    return (
        <button onClick={signInWithGoogle}>
            <img className={styles.signIn} src="google-logo.png" alt="sign in google"/>
        </button>
    )
}

export const SignOutButton = (props) => {
    console.log(props)
    const history = useHistory();
    return (
        <button className={props.className} onClick={async () => { await auth.signOut(); history.push("/") }}>Log out</button>
    )
}

export default Home
