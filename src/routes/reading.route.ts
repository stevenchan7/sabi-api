import { Router } from 'express';
import { createReading, deleteReading, editReading, getReadingById, getReadings } from '../controller/reading.controller';
import { upload } from '../config/multer.config';
import { createReadingValidationRules, editReadingValidationRules } from '../validation/reading.validation';
import { authenticateAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticateAdmin, getReadings);
router.get('/:id', getReadingById);
router.post('/', authenticateAdmin, upload.single('thumbnail'), createReadingValidationRules, createReading);
router.put('/:id', authenticateAdmin, upload.single('thumbnail'), editReadingValidationRules, editReading);
router.delete('/:id', authenticateAdmin, deleteReading);

export default router;
