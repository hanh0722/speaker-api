import { body, param } from "express-validator";

export const validatePayment = [
  body('success_url').not().isEmpty().withMessage('Success URL is must specify'),
  body('cancel_url').not().isEmpty().withMessage('Cancel URL is must specify')
];

export const validateResultPayment = [
  param('id').not().isEmpty().withMessage('Order is not valid')
]