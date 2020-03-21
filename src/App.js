import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Users from './Users';
import { gql } from 'apollo-boost';
import AuthorisedUser from './AuthorisedUser';

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers,
    allUsers { ...userInfo },
    me { ...userInfo }
  }

  fragment userInfo on User {
    githubLogin,
    name,
    avatar,
  }
`;

const App = () => (
  <BrowserRouter>
    <div>
      <AuthorisedUser />
      <Users />
    </div>
  </BrowserRouter>
);

export default App;
