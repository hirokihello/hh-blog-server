#### 概要

hirokihello blog server

vanilla nodejs + ts + graphql + redis

- アプリケーションフレームワークは原則禁止。
- apolloやgraphql-serverは、高性能すぎてフレームワークと呼んでも差し支えないので禁止。


#### lint

prettier + eslint

参考記事
https://blog.ojisan.io/eslint-prettier

#### usage

graphql query sample

```
# test_data.jsの固定のデータが返ってくる。
{
  "query": "{ users { name } }"
}

# redisのデータ操作
{ "query": "mutation { set(key: \"myname\", value: \"myname is ben\") }"}

{
  "query": "query { get(key: \"myname\") }"
}

```
