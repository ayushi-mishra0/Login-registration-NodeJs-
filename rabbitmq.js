// const amqp = require('amqplib');

// let connection;
// let channel;
// const exchange = 'user_exchange';
// const connectRabbitMQ = async () => {
//     try {
//         connection = await amqp.connect('amqp://localhost');
//         channel = await connection.createChannel();
//         console.log('Connected to RabbitMQ');
        
//         await channel.assertExchange(exchange, 'direct' , {durable: true });
//         // Ensure graceful shutdown
//         process.on('exit', async () => {
//             if (channel) await channel.close();
//             if (connection) await connection.close();
//             console.log('RabbitMQ connection closed.');
//         });
//     } catch (error) {
//         console.error('Failed to connect to RabbitMQ:', error);
//         process.exit(1);
//     }
// };


// const getChannel = () => {
//     if (!channel) {
//         throw new Error('RabbitMQ channel is not initialized. Call connectRabbitMQ first.');
//     }
//     return channel;
// };
// module.exports = { connectRabbitMQ, getChannel, exchange };
