import express from 'express'; 
import { expressMiddleware } from '@apollo/server/express4';
import createApolloGraphqlServer from "./graphql";
import { prismaClient } from './lib/db'; // Updated import statement
import UserService from './services/user';

async function init() 
{
    const app = express();
    const PORT = Number(process.env.PORT) || 8000

    app.use(express.json());

    app.get('/', (req, res) => {
        res.json({ message: 'Server is up and running' });
    });

    const gqlServer = await createApolloGraphqlServer();
    app.use(
        "/graphql",
        expressMiddleware(await createApolloGraphqlServer(), {
          context: async ({ req }) => {
            // @ts-ignore
            const token = req.headers["token"];
    
            try {
              const user = UserService.decodeJWTToken(token as string);
              return { user };
            } catch (error) {
              return {};
            }
          },
        })
      );
    

    app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}

init();
