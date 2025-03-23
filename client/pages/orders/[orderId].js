import { useEffect, useState } from 'react';
import Router from 'next/router';

import StripeCheckout from 'react-stripe-checkout';

import useRequest from '../../hooks/useRequest';

const Order = ({ order, currentUser }) => {

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const getTimeLeft = () => {
      const milisecondsLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(milisecondsLeft / 1000));
    }

    getTimeLeft();
    const intervalTimerId = setInterval(getTimeLeft, 1000);

    return () => clearInterval(intervalTimerId);
  }, []);

  const { call, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: { orderId: order.id },
    onSuccess: (payment) => Router.push(`/orders`),
  });

  return (
    <div className="container my-5">
      <h1>Purchasing {order.ticket.title}</h1>
      <h4>Price: {order.ticket.price}</h4>
      {timeLeft > 0 && <p className="mt-3">Your reservation expires in {timeLeft} seconds</p>}
      {timeLeft <= 0 && (
        <div className="alert alert-danger mt-3">
          <ul className="my-0">Your order request has expired, try again later.</ul>
        </div>
      )}
      <hr />
      {timeLeft > 0 && (
        <StripeCheckout email={currentUser.email} amount={order.ticket.price * 100} stripeKey="pk_test_51R39L6CBrgHKdiUm3bLYAh4hKuhZUSpYCnWKo7EClPdBM6ZjdZ5CVcZwqQkBNHUuQ9Jz8PU5WuKnslTXdJ6ZnA2g00NfFq79ey" token={(token) => call({ token: token.id })} />
      )}
      {errors}
    </div>
  );
}

Order.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default Order;