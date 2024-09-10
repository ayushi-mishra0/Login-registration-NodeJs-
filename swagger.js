const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger_output.json'; // The output Swagger JSON file
const endpointsFiles = ['./routes/users.js']; // Path to the API routes file(s)

const doc = {
  info: {
    title: 'Node Express CRUD API',
    description: 'A simple CRUD API using Node.js and Express',
    version: '1.0.0',
  },
  host: 'localhost:3000/users',
  schemes: ['http'],
};

// Generate swagger_output.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./bin/www'); // Run the app after the swagger JSON is generated
});
