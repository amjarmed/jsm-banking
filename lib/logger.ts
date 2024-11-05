// // logger.ts
// import winston from 'winston';

// // Create a custom logger
// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json(), // Logs will be in JSON format
//   ),
//   transports: [
//     new winston.transports.Console(), // Log to console
//     new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to a file
//     new winston.transports.File({ filename: 'logs/combined.log' }), // Log all messages to a file
//   ],
// });

// // If you're not in production, log to the `console` with the format:
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.simple(),
//     }),
//   );
// }

// export default logger;
