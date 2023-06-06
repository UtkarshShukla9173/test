const { dir } = require("console");

const  Pool  = require("pg").Pool;
 const connection = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'root',
    port: 5431, // Default PostgreSQL port
  });

  
  module.exports = connection;