import React, { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Link } from 'react-router-dom';
import { SignOutButton } from './Home';
import { UserContext } from '../lib/context';
import { storage, firestore, auth } from '../lib/firebase';
import Posts from '../components/Posts';



const LIMIT = 10;



function Feed() {
    const [user] = useAuthState(auth);
    const [posts, setPosts] = useState([]);

    async function fetchData() {
        if (!user){
            console.log("plus de user??");
            return
        }
        const postsQuery = await firestore
            .collectionGroup('posts')
            .orderBy('createdAt', 'desc')
            .limit(LIMIT);

        await postsQuery.get().then(querySnapshot => {
            const postList = [];
            querySnapshot.forEach(post => {
                console.log("post", post.data().displayName)
                console.log("user", user.displayName)
                console.log(post.data().displayName !== user.displayName);
                if (post.data().displayName !== user.displayName)
                    postList.push(post.data())
            })
            setPosts(postList);
        });
    }

    async function loadMore() {
        if (posts.length === 0)
            return;
        const last = posts[posts.length - 1];
        const cursor = last.createdAt;
        const postsQuery = await firestore
            .collectionGroup('posts')
            .orderBy('createdAt', 'desc')
            .startAfter(cursor)
            .limit(LIMIT);

        await postsQuery.get().then(querySnapshot => {
                const postList = [];
                querySnapshot.forEach(post => {
                    postList.push(post.data())
                })
                setPosts(posts.concat(postList))
            });
    }

    useEffect(() => {
        console.log("here")
        fetchData();
    }, [])

    return (
        user && <div>
            Feed !
            <SignOutButton/>
            <Link to={{pathname: `profile/${user.displayName}`,
                        state: {isAdmin: true}}}>
                <img src={user.photoURL} alt="profile"/>
            </Link>
            <Posts posts={posts}/>
            <button onClick={loadMore}>Load More</button>
        </div>
    )
}

export default Feed
