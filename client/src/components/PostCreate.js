import React, { useState } from 'react';
import axios from 'axios';

const PostCreate = () => {

  const [title, setTitle] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    await axios.post('http://posts.com/posts/create', { title });
    setTitle('');
    window.location.reload();
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <h3>Create a new Post</h3>
          <input onChange={event => setTitle(event.target.value)} className="form-control" placeholder='What do you have in mind...' />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default PostCreate;