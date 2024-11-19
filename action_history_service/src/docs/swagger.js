const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Product action API',
            version: '1.0.0',
            description: 'API для управления историей действий с продуктами или остатками.'
        },
        servers: [
            {
                url: 'http://localhost:5005/api/v1',
                description: 'Локальный сервер разработки, запросы на api/v1'
            }
        ]
    },
    apis: [
        './src/routes/**/*.js',
        './src/exceptions/**/*.js',
        './src/docs/schemas/**/*.js',
        './src/docs/responses/**/*.js',
        './src/docs/parameters/**/*.js'
    ]
};

export default swaggerOptions;
