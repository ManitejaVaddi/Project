import express from 'express';

import {
  changePassword,
  deleteAccount,
} from '../controllers/accountController.js';

import {
  protect,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/change-password',
  protect,
  changePassword
);

router.delete(
  '/',
  protect,
  deleteAccount
);

export default router;