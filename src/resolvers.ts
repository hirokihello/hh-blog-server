const { users } = require("./testData")
import { client } from "./app";

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    users: () => users,
    get: async ( { key }: { key: string}) => {
      try {
        return client.getAsync(key);
      } catch (e) {
        return null
      }
    }
  },
  Mutation: {
    set: async ( {key, value}: { key: string, value: string}) => {
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

export default resolvers;
