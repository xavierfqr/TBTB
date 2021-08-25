import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SignOutButton } from './Home';
import { UserContext } from '../lib/context';
import { storage, firestore } from '../lib/firebase';
import Posts from '../components/Posts';


const LIMIT = 10;



function Feed() {
    const {user, username} = useContext(UserContext);
    const [posts, setPosts] = useState([]);

    async function fetchData() {
        const postsQuery = await firestore.collectionGroup('posts').limit(LIMIT);
        await postsQuery.get().then(querySnapshot => {
            const postList = [];
            querySnapshot.forEach(post => {
                postList.push(post.data())
            })
            setPosts(postList);
        });
        // const postList = postsGet.docs.map(doc => doc.data());
        // setPosts(postList)
        // console.log(posts)
    } 

    useEffect(() => {
        fetchData()
    }, [])

    return (
        user && <div>
            Feed !
            <SignOutButton/>
            <Link to={`profile/${user.displayName}`}>
                <img src={user.photoURL} alt="profile"/>
            </Link>
            <Posts posts={posts}/>
        </div>
    )
}

export default Feed
