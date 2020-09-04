#### 概要

hirokihello blog server

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
  "query": "{ get(key: \"myname\") }"
}

```
