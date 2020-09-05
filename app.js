const { users } = require("./testData")

const { graphql } = require('graphql')
const { makeExecutableSchema } = require('graphql-tools');
const redis = require("redis");
const bluebird = require("bluebird");
const http = require('http');

const client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype)

client.on("error", function(error) {
  console.error(error);
});

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
    get: async (parent, { key }) => {
      try {
        return client.getAsync(key);
      } catch (e) {
        return null
      }
    }
  },
  Mutation: {
    set: async ( parent, {key, value}) => {
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

const server = http.createServer();

server.on('request', async function(req, res) {
    const headers = req.headers
    if(headers['content-type'] !== 'application/json' || headers['content-length' === 0]) return res.end();

    let arr = [];
    req.on('data', chunk => {
      arr.push(chunk);
    })
    req.on('end', async () => {
      // 空のリクエストの排除
      try {
        JSON.parse(arr)
        if (!JSON.parse(arr).query) return res.end();
        const response = await graphql(schema, JSON.parse(arr).query)
        console.log(response)

        res.writeHead(200, {'Content-Type' : 'application/json'});
        res.write(`${JSON.stringify(response)}`);
    } catch (e) {
        return  res.end();
        ;
    }
      res.end();
    })
});

// サーバを待ち受け状態にする
// 第1引数: ポート番号
// 第2引数: IPアドレス
server.listen(3000);
