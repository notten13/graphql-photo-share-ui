import React from 'react';
import { withRouter } from 'react-router-dom';
import { Query, Mutation, withApollo } from 'react-apollo';
import { gql } from 'apollo-boost';
import { ROOT_QUERY } from './App';

const AUTHENTICATE_WITH_GITHUB_MUTATION = gql`
  mutation authenticateWithGithub($code: String!) {
    authenticateWithGithub(code: $code) {
      token
    }
  }
`;

const Me = ({ logout, requestCode, signingIn }) => (
  <Query query={ROOT_QUERY}>
    {({ loading, data }) =>
      data && data.me
      ? <CurrentUser {...data.me} logout={logout} />
      : (
        loading
        ? <p>Loading...</p>
        : <button
            onClick={requestCode}
            disabled={signingIn}
          >
            Se connecter avec Github
          </button>
      )
    }
  </Query>
);

const CurrentUser = ({ name, avatar, logout }) => (
  <div>
    <img src={avatar} width={50} height={50} alt="My avatar" />
    <h1>{name}</h1>
    <button onClick={logout}>Déconnexion</button>
  </div>
);

class AuthorisedUser extends React.Component {
  state = { signingIn: false };

  componentDidMount() {
    /**
     * If we've been redirected here after authorising on Github, we have
     * a github "code" in the URL. Send this code to the backend
     * in the github auth mutation to obtain an access token
     */
    if (window.location.search.match(/code=/)) {
      this.setState({ signingIn: true });
      const code = window.location.search.replace(/\?code=/, "");
      this.githubAuthMutation({ variables: { code } });
    }
  }

  /**
   * Redirect to Github to authorise user and obtain a code
   */
  requestCode() {
    const clientId = 'cf0d60bead09a3b966f1';
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user`;
  }

  /**
   * Store the access token in local storage and remove code from the URL
   */
  authorisationComplete = (cache, { data }) => {
    localStorage.setItem('token', data.authenticateWithGithub.token);
    this.props.history.replace('/');
    this.setState({ signingIn: false });
  }

  logout = () => {
    localStorage.removeItem('token');
    let data = this.props.client.readQuery({ query: ROOT_QUERY });
    data.me = null;
    // TODO: doesn't refresh UI:
    this.props.client.cache.writeQuery({ query: ROOT_QUERY, data });
  }

  render() {
    return (
      <Mutation
        mutation={AUTHENTICATE_WITH_GITHUB_MUTATION}
        update={this.authorisationComplete}
        refetchQueries={[{ query: ROOT_QUERY }]}
      >
        {(mutation) => {
          this.githubAuthMutation = mutation;
          return (
            <Me
              signingIn={this.state.signingIn}
              requestCode={this.requestCode}
              logout={this.logout}
            />
          )
        }}
      </Mutation>
    );
  }
}

export default withApollo(withRouter((AuthorisedUser)));