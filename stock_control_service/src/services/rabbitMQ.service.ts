import amqp from 'amqplib';
import logger from '../config/logger';
import { Logger } from 'winston';

export class RabbitMQService {
    private logger: Logger;
    private connection: null | amqp.Connection;
    private channel: null | amqp.Channel;

    constructor(logger: Logger) {
        this.logger = logger;
        this.connection = null;
        this.channel = null;
    }

    async connect() {
        try {
            this.connection = await amqp.connect(process.env.RABBITMQ_URL);
            this.channel = await this.connection.createChannel();
            this.logger.info('Connected to RabbitMQ');
            return this.channel;
        } catch (err) {
            this.logger.error('RabbitMQ connection error:', err);
            throw new Error('RabbitMQ connection error');
        }
    }

    async publishMessage(exchange: string, routingKey: string, message: Record<string, unknown>) {
        if (!this.channel) throw new Error('RabbitMQ channel not initialized');
        await this.channel.assertExchange(exchange, 'topic', { durable: true });
        this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
        this.logger.info(`Message sent: ${JSON.stringify(message)}`);
    }

    async consumeMessage(queue: string, onMessage: (message: Record<string, unknown>) => void) {
        if (this.channel) throw new Error('RabbitMQ channel not initialized');
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue, (msg) => {
            if (msg !== null) {
                onMessage(JSON.parse(msg.content.toString()));
                this.channel.ack(msg);
            }
        });
    }
}

export const rabbitMQService = new RabbitMQService(logger);
