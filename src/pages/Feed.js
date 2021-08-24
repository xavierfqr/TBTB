import React, { useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { SignOutButton } from './Home';
import { UserContext } from '../lib/context';


function Feed() {
    const {user, username} = useContext(UserContext);

    return (
        user && <div>
            Feed !
            <SignOutButton/>
            <Link to={`profile/${user.displayName}`}>
                <img src={user.photoURL}/>
            </Link>
        </div>
    )
}

export default Feed
