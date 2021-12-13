import schemaDirectives from '@/main/graphql/directives'
import resolvers from '@/main/graphql/resolvers'
import typeDefs from '@/main/graphql/type-defs'
import { ApolloServer } from 'apollo-server-express'

export const makeApolloServer = (): ApolloServer => new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  context: ({ req }) => ({ req })
})
