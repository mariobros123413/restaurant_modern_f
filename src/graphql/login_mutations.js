import { gql } from "@apollo/client";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(email: $username, password: $password)
  }
`;

export default LOGIN_MUTATION;
