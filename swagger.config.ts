export const swaggerDoc = {
  info: {
    title: "Dragons of Mugloar API",
    version: "1.0.0",
  },
  host: process.env.BACKEND_URL || "localhost:3000",
  schemes: ["http"],
};

export const swaggerOptions = {
  customSiteTitle: "BigBank Test API",
  customCssUrl: 'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css',
  customJs: [
    'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js',
    'https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js',
  ],
};
