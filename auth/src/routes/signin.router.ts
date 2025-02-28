import { BadRequestError, validateRequest } from '@ticketing-microsservices/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { PasswordService } from '../services/password-service';
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/signin', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('Password is required')
], validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError('Invalid Credentials');
  }

  const passwordsMatch = await PasswordService.compare(user.password, password);
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid Credentials');
  }

  const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!)
  req.session = { jwt: userJwt };

  res.status(200).send(user);
});

export { router as signInRouter };
