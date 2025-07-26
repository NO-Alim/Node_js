import winston from "winston";
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const logger = winston.createLogger({
    level: process.env.NODE_ENV ==='production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.errors({ stack: true}),
        winston.format.splat(),
        winston.format.json()
    ),

    // Define a transports where logs will be sent
    transports: [

        // console transports for development
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message} ${info.stack ? '\n' + info.stack : ''}`
                )
            )
        }),

        // file transport for error logs (producton)
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB (maximum file size before rotation)
            maxFiles: 5, // Keep up to 5 rotated log files
            tailable: true // Start reading from the end of the file when streaming
        }),
        new winston.transports.File({
            filename: path.join(__dirname, '../logs/combined.log'), // Path to combined log file
            maxsize: 10485760, // 10MB
            maxFiles: 10,
            tailable: true
        })

    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: path.join(__dirname, '../logs/exceptions.log') })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: path.join(__dirname, '../logs/rejections.log') })
    ]
});


export default logger;