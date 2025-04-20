import { createSchema, createYoga } from 'graphql-yoga'
import { createServer } from 'node:http'

import { typeDefs } from './graphql/schema/typeDefs.js'
import { resolvers } from './resolvers/index.js'

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: '/graphql',
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.log('🚀 GraphQL Yoga running at http://localhost:4000/graphql')
})
