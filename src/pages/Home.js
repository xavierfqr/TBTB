import React from 'react';
import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { useHistory, Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';


function Home() {
    const [user] = useAuthState(auth);

    return (
        <main>
            {!user ? (
                <div>
                    <h1>Sign In</h1>
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
            CLICK HERE
        </button>
    )
}

export const SignOutButton = () => {
    const history = useHistory();
    return (
        <button onClick={() => { auth.signOut(); history.push("/") }}>Sign Out</button>
    )
}

export default Home
