import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Define el link HTTP para conectar con el servidor GraphQL
const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

// Define el link de autenticación para agregar el token a los headers
const authLink = setContext((_, { headers }) => {
  // Obtén el token de almacenamiento local o cualquier otro almacenamiento seguro
  const token = localStorage.getItem('loggedFocusEvent');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Crea el cliente Apollo combinando authLink y httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: {
      errorPolicy: 'all', // Manejar errores de mutación
    },
  },
});

export default client;
