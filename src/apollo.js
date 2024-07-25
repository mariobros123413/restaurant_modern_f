import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://restaurant-modern.fly.dev/graphql',
  // uri:'http://localhost:8080/graphql'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('loggedFocusEvent');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
