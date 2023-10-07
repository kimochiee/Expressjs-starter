const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    failOnErrors: true,
    openapi: "3.0.0",
    info: {
      title: "Expressjs starter",
      version: "1.0.0",
      description: "A basic Rest-API for starter",
      contact: {
        name: "Nguyen Quan - kimochiee",
        url: "https://github.com/kimochiee",
        email: "kendystar147@gmail.com",
      },
    },
    components: {
      securitySchemes: {
        Authorization: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          value: "Bearer <JWT token here",
        },
      },
    },
    servers: [
      {
        url: "http://localhost:8000",
        url: "https://expressjs-starter.onrender.com",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app, port) => {
  app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
