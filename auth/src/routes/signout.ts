import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signout', (req: Request, res: Response) => {
  req.session = null;
  res.end();
});

export { router as signOutRouter };
