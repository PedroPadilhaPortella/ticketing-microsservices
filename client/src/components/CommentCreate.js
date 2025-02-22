import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommentCreate = ({ postId }) => {

  const [content, setContent] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    await axios.post(`http://posts.com/posts/${postId}/comments`, { content });
    setContent('');
    window.location.reload();
  }

  return (
    <div className='pt-4'>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <h5>Add a new Comment</h5>
          <input value={content} onChange={event => setContent(event.target.value)} className="form-control" />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default CommentCreate;