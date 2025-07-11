require("dotenv").config();
// In this file you can configure migrate-mongo

const config = {
  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url:
      process.env.DB_URL ||
      "mongodb+srv://bobur:bobur123@cluster-1.hsove6g.mongodb.net/Clients_db?retryWrites=true&w=majority&appName=Cluster-1",

    // TODO Change this to your database name:
    databaseName: "Clients_db",

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    },
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: "migrations",

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: "changelog",

  // The file extension to create migrations and search for in migration dir
  migrationFileExtension: ".js",
migrationFileGenerator: "./migration-template.js",
  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
  // if the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: false,
};

// Return the config as a promise
module.exports = config;
