import { Router } from 'express';
import { authenticateAdmin, authenticateStudent } from '../middlewares/auth.middleware';
import { editUserAvatar, getUsers } from '../controller/user.controller';
import { upload } from '../config/multer.config';

const router = Router();

router.get('/', authenticateAdmin, getUsers);
router.patch('/:id', authenticateStudent, upload.single('avatar'), editUserAvatar);

export default router;
