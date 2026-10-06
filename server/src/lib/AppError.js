class AppError extends Error {
  constructor({ statusCode = 500, code = 'INTERNAL_ERROR', message = 'Something went wrong', details = [] }) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.details = details;
  }
}

export default AppError;
