import React from 'react';

import PostCreate from './components/PostCreate';
import PostList from './components/PostList';

const App = () => {
  return (
    <div className='container'>
      <h1 className='py-4'>Blog Microsservices</h1>
      <PostCreate />
      <hr className='py-4' />
      <PostList />
    </div>
  );
}

export default App;