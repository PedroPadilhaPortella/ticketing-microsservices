import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const SignUp = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { call, errors } = useRequest({
    url: '/api/users/signup',
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
      <h1>Sign Up</h1>
      <div className="form-group mt-3">
        <label>Email Address</label>
        <input type="text" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="form-group mt-3">
        <label>Password</label>
        <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      {errors}
      <button className="btn btn-primary mt-3">Sign Up</button>
    </form>
  );
}

export default SignUp;