class ApiError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static BadRequest(message) {
    return ApiError(400, message);
  }

  static UnauthorizedRequest(message) {
    return ApiError(401, message);
  }

  static ForbiddenRequest(message) {
    return ApiError(403, message);
  }

  static Internal(message) {
    return ApiError(500, message);
  }
}

module.exports = ApiError;
