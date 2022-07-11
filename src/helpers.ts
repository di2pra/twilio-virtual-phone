import { Response } from "express";

export class ErrorHandler extends Error {

  statusCode: number;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }

}


/**
 * Express JS Error Handler Middleware
 * @param {Error} err
 * @param {Response} res
 * @return {void}
 */
export const handleError = (err: Error, res: Response): void => {

  if (err instanceof ErrorHandler) {

    const { statusCode, message } = err;
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message
    });

  } else {

    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: err.message
    });

  }

};

/**
 * Checks if the given value is valid as phone number
 * @param {Number|String} number
 * @return {Boolean}
 */
export function isAValidPhoneNumber(number: number | string): boolean {
  return /^[\d\+\-\(\) ]+$/.test(number.toString());
}