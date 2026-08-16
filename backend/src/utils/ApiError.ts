class ApiError extends Error {
  statusCode: number;
  isApiError: true;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isApiError = true;
  }
}

export default ApiError;
