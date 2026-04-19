require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./config/db');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { getUser } = require('./middleware/auth');

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const app = express();

  app.use(cors());
  app.use(express.json());

  // Create Apollo Server instance
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // Extract token from Authorization header and attach user to context
      const token = req.headers.authorization || '';
      const user = await getUser(token);
      return { user };
    },
    // Show detailed errors in development
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        locations: error.locations,
        path: error.path,
      };
    },
  });

  await apolloServer.start();

  // Apply Apollo middleware to Express
  apolloServer.applyMiddleware({
    app,
    path: '/graphql',
    cors: false, // Already handled by cors middleware above
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 CivicCase server running on port ${PORT}`);
    console.log(`📡 GraphQL endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
