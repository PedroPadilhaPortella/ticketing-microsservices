import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>;
}

LandingPage.getInitialProps = async (context) => {
  const httpClient = buildClient(context);
  const response = await httpClient.get('api/users/currentUser');
  return response.data;
};

export default LandingPage;