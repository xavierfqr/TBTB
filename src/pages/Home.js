import React from 'react';
import { auth, googleAuthProvider } from '../lib/firebase';
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
        await auth.signInWithPopup(googleAuthProvider);
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
