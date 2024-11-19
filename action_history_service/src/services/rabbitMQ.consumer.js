import amqp from 'amqplib';
import logger from '../config/logger.js';
import { actionHistoryService } from './actionHistory.service.js';

class RabbitMQConsumer {
    constructor(logger, actionService) {
        this.logger = logger;
        this.actionService = actionService;
    }

    async connect() {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            const channel = await connection.createChannel();

            const exchange = 'events_exchange';
            await channel.assertExchange(exchange, 'topic', { durable: true });

            const queue = 'history_service_queue';
            await channel.assertQueue(queue, { durable: true });
            await channel.bindQueue(queue, exchange, '#');

            this.logger.info('RabbitMQ connected. Waiting for messages...');

            channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    const event = JSON.parse(msg.content.toString());
                    this.logger.info('Received event:', event);

                    await this.actionService.createAction(event.action, event.shopId, event.plu, event.metadata);

                    channel.ack(msg);
                }
            });
        } catch (err) {
            this.logger.error('RabbitMQ connection error:', err);
            process.exit(1);
        }
    }
}

export const rabbitMQConsumer = new RabbitMQConsumer(logger, actionHistoryService);
