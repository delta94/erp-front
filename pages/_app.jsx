import 'antd/dist/antd.css';
import '../styles/globals.scss';
import { Provider } from 'react-redux';
import store from '../store';

// eslint-disable-next-line react/prop-types
const MyApp = ({ Component, pageProps }) => (
  <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
);

export default MyApp;
