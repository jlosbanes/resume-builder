import cors from "cors";
import express from "express";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import http from "http";
import PDFParser from "pdf2json";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

const typeDefs = `#graphql
  scalar Upload

  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Mutation {
    # Multiple uploads are supported. See graphql-upload docs for details.
    singleUpload(file: Upload!): File!
  }

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const decodePdfTexts = (texts: any[]): string => {
  return texts
    .map((textObj) => textObj.R.map((r) => decodeURIComponent(r.T)).join(""))
    .join(" ");
};
const resolvers = {
  Upload: GraphQLUpload,

  Mutation: {
    singleUpload: async (parent, { file }) => {
      const { createReadStream } = await file;

      const chunks: Buffer[] = [];

      const readStream = createReadStream();
      readStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      readStream.on("end", () => {
        const parser = new PDFParser();

        parser.on("pdfParser_dataReady", (data) => {
          parser.getRawTextContent();
          console.log(
            "pdfParser_dataReady",
            data.Pages.map((p) => decodePdfTexts(p.Texts))
          );
        });

        parser.parseBuffer(Buffer.concat(chunks));
      });

      readStream.on("error", (err) => {
        console.error("Error:", err);
      });

      return { filename: "", mimetype: "", encoding: "" };
    },
  },

  Query: {
    books: () => books,
  },
};

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ApolloServerPluginDrainHttpServer({ httpServer }),
  ],
});

await server.start();
app.use(
  "/",
  cors<cors.CorsRequest>({ origin: ["*"] }),
  express.json(),
  graphqlUploadExpress(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

await new Promise<void>((r) => httpServer.listen({ port: 4000 }, r));
console.log(`🚀 Server ready at http://localhost:4000/`);
