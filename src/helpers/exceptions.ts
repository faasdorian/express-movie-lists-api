export default interface ApiError {
  readonly statusCode: number,
  readonly message: string,
  readonly source?: Error
}

export class NotFoundError implements ApiError {
  readonly statusCode = 404

  constructor(
    readonly message: string = 'Not Found',
    readonly source?: Error | undefined
  ) { }
}

export class InternalServerError implements ApiError {
  readonly statusCode = 500

  constructor(
    readonly message: string = 'Something went wrong',
    readonly source?: Error | undefined
  ) { }
}

export class UnauthorizedError implements ApiError {
  readonly statusCode = 401

  constructor(
    readonly message: string = 'Unauthorized',
    readonly source?: Error | undefined
  ) { }
}

export class BadRequestError implements ApiError {
  readonly statusCode = 400

  constructor(
    readonly message: string = 'Bad Request',
    readonly source?: Error
  ) { }
}
