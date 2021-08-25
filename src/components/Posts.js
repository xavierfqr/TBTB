import React from 'react';
import ReactAudioPlayer from 'react-audio-player';


function Posts({posts}) {
    return posts ? posts.map((post, index) => {
                return (<div key={index}>
                    <Post post={post}/>
                    </div>
                )
            }) : null;
}

function Post({post}) {
    return (
        <div>
            <ReactAudioPlayer
                controls
                autoPlay={false}
                src={post.audioFile}/>
            <p>{post.title}</p>
        </div>
    )
}

export default Posts
