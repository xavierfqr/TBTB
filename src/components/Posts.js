import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import styles from './Posts.module.css'


function Posts({posts}) {
    return (
        <div className={styles.content}>
            {posts ? posts.map((post, index) =>
                (<div key={index}>
                    <Post post={post}/>
                    </div>
                )) : null}
        </div>)
}

function Post({post}) {
    const [user] = useAuthState(auth);
    return (
        <div className={styles.wrapper}>
            <div className={styles.profileTitle}>
                <Link className={styles.profile} to={{pathname: `/profile/${post.displayName}`, state: {isAdmin: post.displayName === user.displayName}}}><img className={styles.img} src={user.photoURL}/><i>@{post.displayName}</i></Link>
                <h2 className={styles.title}>{post.title}</h2>
            </div>
            <ReactAudioPlayer className={styles.audio}
                controls
                autoPlay={false}
                src={post.audioFile}/>
            <p className={styles.heartCount}>{post.heartCount} 💗</p>
        </div>
    )
}

export default Posts
