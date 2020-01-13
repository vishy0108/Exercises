export const HTTP_RESPONSE_CODES = {
  STATUS_SUCCESS: 200,
  CLIENT_ERROR: 400,
  SERVER_ERROR: 500,
};

export class ValidationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class GatewayNotConnectedError extends ValidationError {
  constructor() {
    super("Fabric CA Client not connected to network");
    this.name = "GateWayNotConnectedError";
  }
}

export class IdentityNotFoundError extends ValidationError {
  constructor() {
    super("Identity not registered with network");
    this.name = "IdentityNotFoundError";
  }
}
