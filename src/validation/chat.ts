import { body } from "express-validator";

export const ChatValidation = [
  body('message').not().isString().withMessage('Message is not valid')
  .custom((message, {req}) => {
    const trimMessage = message.trim() as string;
    if (trimMessage.length === 0) {
      return Promise.reject()
    }
  }),
  body('room').not().isString().withMessage('Room is not valid'),
  body('receiver').not().isString().withMessage('Message without receiver')
  .custom((receiver, {req}) => {
    
  })
];

