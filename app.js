const express = require('express');
const { users } = require("./testData")
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const redis = require("redis");
const bluebird = require("bluebird");

const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype)


client.on("error", function(error) {
  console.error(error);
});

client.set("key", "value", redis.print);
client.get("key", redis.print);

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

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    users: () => users,
    get: async (parent, { key }, { client }) => {
      try {
        return client.getAsync(key);
      } catch (e) {
        return null
      }
    }
  },
  Mutation: {
    set: async ( parent, {key, value}, {client}) => {
      try {
        await client.set(key, value);
        return true
      } catch(e) {
        console.log(e);
        return false
      }
    }
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, context: { client } }));
// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000`)
);
