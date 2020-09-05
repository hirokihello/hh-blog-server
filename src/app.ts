
const { graphql } = require('graphql')
const { makeExecutableSchema } = require('graphql-tools');
const redis = require("redis");
const bluebird = require("bluebird");
import http, {IncomingMessage, ServerResponse} from 'http'

const client = redis.createClient();

import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype)

client.on("error", function(error: string) {
  console.error(error);
});

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = http.createServer();

server.on('request', async function(req: IncomingMessage, res: ServerResponse) {
    const headers = req.headers
    if(headers['content-type'] !== 'application/json' || headers['content-length'] === "0") return res.end();

    let arr: string[] = [];
    req.on('data', (chunk: string) => {
      arr.push(chunk);
    })
    req.on('end', async () => {
      // 空のリクエストの排除
      try {
        // joinしなくても動くが型をつけるため
        JSON.parse(arr.join())
        if (!JSON.parse(arr.join()).query) return res.end();
        const response = await graphql(schema, JSON.parse(arr.join()).query)
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

server.listen(3000);

export { client }
