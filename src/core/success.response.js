"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: "OK",
  CREATED: "Created",
};

class SuccessResponse {
  constructor({
    message = ReasonStatusCode.OK,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }) {
    this.message = !message ? ReasonStatusCode.OK : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res, header = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata, options = {} }) {
    super({
      message,
      metadata,
      options,
    });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata,
  }) {
    super({
      message,
      statusCode,
      reasonStatusCode,
      metadata,
    });
  }
}

module.exports = {
  OK,
  CREATED,
};
