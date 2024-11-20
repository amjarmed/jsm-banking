import fs from 'fs';
import path from 'path';

class Logger {
  private logFilePath: string;

  constructor(logFileName: string = 'app.log', logDir: string = 'logs') {
    this.logFilePath = path.join(logDir, logFileName);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, {recursive: true});
    }
  }

  /**
   * Writes a log message to the file with a timestamp.
   * Automatically stringifies objects for better readability.
   * @param message - The log message to write (string or object).
   */
  public log(message: string | object): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${
      typeof message === 'object' ? JSON.stringify(message, null, 2) : message
    }\n`;

    fs.appendFile(this.logFilePath, logEntry, (err) => {
      if (err) {
        console.error('Failed to write log:', err);
      }
    });
  }
}

export default Logger;

// Example usage
const logger = new Logger();
logger.log('This is a string log message.');
logger.log({action: 'LOGIN', status: 'SUCCESS', userId: 123});
logger.log(['Item1', 'Item2', 'Item3']);
