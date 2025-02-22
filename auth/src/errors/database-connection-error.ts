import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  reason = 'Error connecting to the database';
  statusCode = 500;

  constructor() {
    super('DatabaseConnectionError');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}