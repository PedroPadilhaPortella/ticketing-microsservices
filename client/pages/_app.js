import 'bootstrap/dist/css/bootstrap.css';

import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
}

AppComponent.getInitialProps = async (appContext) => {
  const httpClient = buildClient(appContext.ctx);
  const response = await httpClient.get('api/users/currentUser');

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { pageProps, ...response.data };
};

export default AppComponent;