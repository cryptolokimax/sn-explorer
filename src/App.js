import React from "react";
import { Grommet } from 'grommet';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import ServiceNode from './pages/ServiceNode'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
});


function Index() {
  return <h2>Home</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

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
      <ApolloProvider client={client}>
        <Grommet theme={theme} full>
          <nav>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/sn/:publicKey" component={ServiceNode} />
          <Route path="/users/" component={Users} />
        </Grommet>
      </ApolloProvider>
    </Router>
  );
}

export default AppRouter;