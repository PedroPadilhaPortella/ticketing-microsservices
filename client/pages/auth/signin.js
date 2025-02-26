import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';

import useRequest from '../../hooks/useRequest';

const SignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { call, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/'),
  });

  const submit = async (event) => {
    event.preventDefault();
    await call();
  }

  return (
    <form className='container my-5' onSubmit={submit}>
      <h1>Sign In</h1>
      <div className="form-group mt-3">
        <label>Email Address</label>
        <input type="text" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="form-group mt-3">
        <label>Password</label>
        <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      {errors}
      <button className="btn btn-primary mt-3">Sign In</button>
      <p className="mt-3">Don't have an account, <Link href="/auth/signup">sign up here</Link></p>
    </form>
  );
}

export default SignIn;