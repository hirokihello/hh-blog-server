#### 概要

hirokihello blog server

学習のためサーバーサイドに関してアプリケーションフレームワークは原則禁止。
apolloやgraphql-serverは、高性能すぎてフレームワークと呼んでも差し支えないので禁止。

#### usage


graphql query sample

```
# test_data.jsの固定のデータが返ってくる。
{
  "query": "{ users { name } }"
}

# redisのデータ操作
{
  "mutation": {
    set(key: \"myname\", value: \"myname is ben\")
  }
}


{
  "query": "query { get(key: \"myname\") }"
}

```
