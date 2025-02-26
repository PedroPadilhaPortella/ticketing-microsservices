import { useEffect } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/useRequest';

const SignOut = () => {

  const { call } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    setTimeout(() => {
      call();
    }, 1000);
  }, []);

  return (<div>Signing you out...</div>);
}

export default SignOut;