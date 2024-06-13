import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://restaurant-modern-23.fly.dev/graphql',
    cache: new InMemoryCache()
});

export default client;  // Nota que aquí se está usando export default
