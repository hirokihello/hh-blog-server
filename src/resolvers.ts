import users from "./testData";
import { promisify } from "util";

import redis from "redis";
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

client.on("error", function (error: string) {
  console.error(error);
});

const resolvers = {
  Query: {
    hello: (): string => "Hello world!",
    users: () => users,
    get: async (parent: undefined, { key }: { key: string }) => {
      try {
        return getAsync(key);
      } catch (e) {
        return null;
      }
    },
  },
  Mutation: {
    set: async (
      parent: undefined,
      { key, value }: { key: string; value: string }
    ) => {
      try {
        console.log({ key });
        await client.set(key, value);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
};

export default resolvers;
