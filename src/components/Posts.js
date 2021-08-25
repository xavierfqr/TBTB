import React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';


function Posts({posts}) {
    return posts ? posts.map((post, index) => {
                return (<div key={index}>
                    <Post post={post}/>
                    </div>
                )
            }) : null;
}

function Post({post}) {
    const [user] = useAuthState(auth);
    return (
        <div>
            <ReactAudioPlayer
                controls
                autoPlay={false}
                src={post.audioFile}/>
            <p>{post.createdAt.toDate().toString()}</p>
            <p>{post.title}</p>
            <p>{post.heartCount}</p>

            <Link to={{pathname: `/profile/${post.displayName}`, state: {isAdmin: post.displayName === user.displayName}}}>{post.displayName}</Link>
        </div>
    )
}

export default Posts
