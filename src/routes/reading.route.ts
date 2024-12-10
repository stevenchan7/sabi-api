import { Router } from 'express';
import { createReading, deleteReading, editReading, getReadingById, getReadings } from '../controller/reading.controller';
import { upload } from '../config/multer.config';
import { createReadingValidationRules, editReadingValidationRules } from '../validation/reading.validation';
import { authenticateAdmin } from '../middlewares/auth.middleware';
import { validate } from '../helpers/validation.helper';

const router = Router();

router.get('/', authenticateAdmin, getReadings);
router.get('/:id', getReadingById);
router.post('/', authenticateAdmin, upload.single('thumbnail'), createReadingValidationRules, validate, createReading);
router.put('/:id', authenticateAdmin, upload.single('thumbnail'), editReadingValidationRules, validate, editReading);
router.delete('/:id', authenticateAdmin, deleteReading);

export default router;
