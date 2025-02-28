import { currentUser } from '@ticketing-microsservices/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/users/currentUser', currentUser, (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
