import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node.js Express API with Swagger', // Tên API
    version: '1.0.0', // Phiên bản API
    description: 'A sample API documentation using Swagger for Node.js and Express Web-Ecommerce', // Mô tả API',
    contact: {
      name: 'Developer',
      email: 'developer@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000', // URL của server
    },
  ],
};

const options = {
  swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./src/routers/*.js'], // Đường dẫn file chứa các API
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at /api-docs');
};