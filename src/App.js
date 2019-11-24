import React from 'react';
import { Grommet } from 'grommet';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import ServiceNode from './pages/ServiceNode';
import Index from './pages/Index';
import Status from './pages/Status';
import Height from './pages/Height';
import Users from './pages/Users';
import User from './pages/User';

import StatsContainer from './lib/statsContainer';

const client = new ApolloClient({
  // uri: 'http://localhost:3999',
  uri: 'http://lokidashboard.com:3999/',
});


const theme = {
  global: {
    colors: {
      brand: '#228BE6',
    },
    font: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      size: '18px',
      height: '20px',
    },
  },
};


function AppRouter() {
  return (
    <Router>
      <Grommet theme={theme} full>
        <nav />
        <Route path="/" exact component={Index} />
        <Route path="/height/:height" component={Height} />
        <Route path="/sn/:publicKey" component={ServiceNode} />
        <Route path="/users/:pageParam?" component={Users} />
        <Route path="/user/:address/:pageParam?" component={User} />
        <Route path="/status/:statParam/:pageParam?" component={Status} />
      </Grommet>
    </Router>
  );
}

function AppContainer() {
  return (
    <ApolloProvider client={client}>
      <StatsContainer.Provider initialState={{ data: {} }}>
        <AppRouter />
      </StatsContainer.Provider>
    </ApolloProvider>
  );
}

export default AppContainer;
