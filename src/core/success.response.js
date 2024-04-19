"use strict";

const StatusCode = { CREATED: 200, OK: 201 };
const ReasonStatusCode = {
  CREATED: "Created",
  OK: "Success",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.OK, // Sửa thành StatusCode.OK
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }
  send(res, header = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata }); // Sửa super() với các tham số cần truyền vào
  }
}

class CREATED extends SuccessResponse {
  constructor({
    options = {},
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata,
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}
module.exports = { OK, CREATED, SuccessResponse };
