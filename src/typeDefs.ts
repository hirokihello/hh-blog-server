// Construct a schema, using GraphQL schema language
const typeDefs = `
  type User {
    id: Int
    name: String
    age: Int
    created_at: String
  }
  type Mutation {
    set(key: String!, value: String!): Boolean
  }
  type Query {
    hello: String
    users: [User]
    get(key: String!): String
  }
`;

export default typeDefs;
