export default interface ApiError {
  readonly statusCode: number,
  readonly message: string | string[],
  readonly source?: Error
}

export class NotFoundError implements ApiError {
  readonly statusCode = 404

  constructor(
    readonly message: string | string[] = 'Not Found',
    readonly source?: Error | undefined
  ) { }
}

export class InternalServerError implements ApiError {
  readonly statusCode = 500

  constructor(
    readonly message: string | string[] = 'Something went wrong',
    readonly source?: Error | undefined
  ) { }
}

export class UnauthorizedError implements ApiError {
  readonly statusCode = 401

  constructor(
    readonly message: string | string[] = 'Unauthorized',
    readonly source?: Error | undefined
  ) { }
}

export class BadRequestError implements ApiError {
  readonly statusCode = 400

  constructor(
    readonly message: string | string[] = 'Bad Request',
    readonly source?: Error
  ) { }
}

export class ForbiddenError implements ApiError {
  readonly statusCode = 403

  constructor(
    readonly message: string | string[] = 'Forbidden',
    readonly source?: Error
  ) { }
}
