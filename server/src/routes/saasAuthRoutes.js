import { Router } from 'express';
import { registerWorkspace, loginSaaSUser, googleAuth } from '../controllers/saasAuthController.js';

const router = Router();

router.post('/register', registerWorkspace);
router.post('/login', loginSaaSUser);
router.post('/google', googleAuth);

export default router;

