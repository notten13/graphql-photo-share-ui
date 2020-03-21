import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import { ROOT_QUERY } from './App';

// TODO: bet practise to organise these queries and mutations so they're not scattered in the code?
const ADD_FAKE_USERS_MUTATION = gql`
  mutation addFakeUsers($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin,
      name,
      avatar,
    }
  }
`;

const Users = () =>
  <Query query={ROOT_QUERY} /* pollInterval={1000} */>
    {({ loading, data, refetch }) =>
      loading
      ? 'Users loading...'
      : <UsersList users={data.allUsers} count={data.totalUsers} refetch={refetch} />
    }
  </Query>;

const UsersList = ({ users, count, refetch }) => (
  <div>
    <p>Nombre d'utilisateurs: {count}</p>
    <button onClick={() => refetch()}>Rafraichir</button>
    <Mutation
      mutation={ADD_FAKE_USERS_MUTATION}
      variables={{ count: 1 }}
      refetchQueries={[{ query: ROOT_QUERY }]}
    >
      {addFakeUsers => (
        <button onClick={addFakeUsers}>Ajouter un utilisateur</button>
      )}
    </Mutation>
    <ul>
      { users.map(user =>
        <UserListItem
          key={user.githubLogin}
          name={user.name}
          avatar={user.avatar}
        />
      )}
    </ul>
  </div>
);

const UserListItem = ({ name, avatar }) => (
  <li>
    <img src={avatar} width={50} height={50} alt={name} />
    {name}
  </li>
);

export default Users;