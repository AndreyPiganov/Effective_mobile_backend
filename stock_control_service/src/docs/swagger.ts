import { SwaggerOptions } from 'swagger-ui-express';

const swaggerOptions: SwaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Management API',
            version: '1.0.0',
            description: 'API для управления остатками, магазинами и товарами.'
        },
        servers: [
            {
                url: 'http://localhost:5004/api/v1',
                description: 'Локальный сервер разработки, запросы на api/v1'
            }
        ]
    },
    apis: [
        './src/dto/*.ts',
        './src/routes/**/*.ts',
        './src/exceptions/**/*.ts',
        './src/docs/schemas/**/*.ts',
        './src/docs/responses/**/*.ts',
        './src/docs/parameters/**/*.ts'
    ]
};

export default swaggerOptions;
