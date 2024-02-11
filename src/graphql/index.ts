import { ApolloServer } from "@apollo/server";
import { User } from "./user"; 

async function createApolloGraphqlServer() {
    // Create Graphql Server
    const gqlServer = new ApolloServer({
        typeDefs: `         
            type Query {
                ${User.queries}
                hello: String
            }
            type Mutation {
                ${User.mutations}
            }
        `,   //Schema
        resolvers: 
        {   //actual function who going execute
            Query: 
            {
                ...User.resolvers.queries,
            },
            Mutation: 
            {
                ...User.resolvers.mutations,
            },
        },
    
    });
    // Start the gql server
    await gqlServer.start()

    return gqlServer;
}


export default createApolloGraphqlServer;