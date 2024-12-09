import { Router } from 'express';
import { createReading, getReadingById } from '../controller/reading.controller';
import { upload } from '../config/multer.config';
import { createReadingValidationRules } from '../validation/reading.validation';
import { authenticateAdmin, authenticateStudent } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:id', authenticateStudent, getReadingById);
router.post('/', authenticateAdmin, upload.single('thumbnail'), createReadingValidationRules, createReading);

export default router;
