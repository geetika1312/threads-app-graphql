import express from 'express'; 
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db'; // Updated import statement

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000

    app.use(express.json());

// Create Graphql Server
    const gqlServer = new ApolloServer({
        typeDefs: `         
            type Query {
                hello: String
                say(name: String): String
            }
            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
            }
        `,   //Schema
        resolvers: {   //actual function who going execute
            Query: {
                hello: () => `Hey there, I am a graphql server`,
                say: (_, { name }: { name: string }) => `Hey ${name}, How are you?`,
            },
            Mutation: 
            {
                createUser: async (_, { firstName, lastName, email, password }) => {
                    await prismaClient.user.create({
                        data: {
                            email,
                            firstName,
                            lastName,
                            password,
                            salt: "random_salt",
                            profileImageURL: "default_profile_image_url" // provide a default value or null if appropriat
                        },
                    });
                    return true;                
                },
            },
        },
    });

// Start the gql server
    await gqlServer.start()

    app.get('/', (req, res) => {
        res.json({ message: 'Server is up and running' });
    });

    app.use("/graphql", expressMiddleware(gqlServer));

    app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}

init();
