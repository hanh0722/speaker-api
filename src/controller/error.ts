import { ErrorRequestHandler } from "express";

export const handleError: ErrorRequestHandler = (err, req, res, next) => {
  const message = err?.message || "Server Internal Error";
  const code = err?.code || 500;
  res.json({
    message: message,
    code: code,
  });
};
