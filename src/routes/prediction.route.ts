import { Router } from 'express';
import { authenticateAdmin, authenticateStudent } from '../middlewares/auth.middleware';
import { getPredictions, postPrediction } from '../controller/prediction.controller';
import { upload } from '../config/multer.config';

const router = Router();

router.get('/', authenticateAdmin, getPredictions);
router.post('/', authenticateStudent, upload.single('image'), postPrediction);

export default router;
