import React from 'react';
import styles from './Navbar.module.css';
import {auth} from '../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import { SignOutButton } from '../pages/Home';


function Navbar() {
    const [user] = useAuthState(auth);
    return (
        <nav>
            <div className={styles.left}>
                <img className={styles.img} src="penguin.png" alt="penguin"/>
                <h1 className={styles.name}>ToBeTheBest</h1>
            </div>
            {user && 
            <div className={styles.right}>
                <SignOutButton className={styles.logOut}/>
                <Link to={{pathname: `profile/${user.displayName}`,
                            state: {isAdmin: true}}}>
                    <img className={styles.img} src={user.photoURL} alt="profile"/>
                </Link>
            </div>
            }
        </nav>
    )
}

export default Navbar