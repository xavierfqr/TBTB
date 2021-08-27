import React, { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
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
            <h1>Feed !</h1>
            <Posts posts={posts}/>
            <button onClick={loadMore}>Load More</button>
        </div>
    )
}

export default Feed
