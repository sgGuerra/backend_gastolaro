import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GastoClaro API',
      version: '1.0.0',
      description: 'Documentación oficial de la API de GastoClaro para finanzas personales.',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local server',
      },
      {
        url: 'https://tu-api-en-produccion.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Rutas donde Swagger buscará anotaciones JSDoc para generar la doc:
  apis: ['./src/interface/routes/*.ts', './src/interface/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "GastoClaro API Docs",
    customCss: '.swagger-ui .topbar { display: none }',
  }));
  console.log('📄 Swagger docs available at: /api/v1/docs');
};
