export class ApiError extends Error {
  status: number;
  detalhes?: unknown;

  constructor(status: number, message: string, detalhes?: unknown) {
    super(message);
    this.status = status;
    this.detalhes = detalhes;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
