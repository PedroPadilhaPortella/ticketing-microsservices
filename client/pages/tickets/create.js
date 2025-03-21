import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/useRequest';

const CreateTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { call, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: (_) => Router.push('/'),
  });

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;
    setPrice(value.toFixed(2));
  }

  const submit = async (event) => {
    event.preventDefault();
    await call();
  }

  return (
    <div className="container my-5">
      <h1>Create a Ticket</h1>
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" className="form-control"
            value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input type="text" className="form-control" onBlur={onBlur}
            value={price} onChange={e => setPrice(e.target.value)} />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default CreateTicket;