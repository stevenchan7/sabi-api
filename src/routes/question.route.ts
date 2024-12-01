import { Router } from 'express';
import { authenticateAdmin } from '../middlewares/auth.middleware';
import { createQuestion, deleteQuestion, editQuestion, getQuestionById, getQuestions } from '../controller/question.controller';
import { createQuestionValidationRules, editQuestionValidationRules } from '../validation/question.validation';
import { validate } from '../helpers/validation.helper';
import { upload } from '../config/multer.config';

const router = Router();

router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.post('/', authenticateAdmin, upload.single('question'), createQuestionValidationRules, validate, createQuestion);
router.put('/:id', authenticateAdmin, editQuestionValidationRules, validate, editQuestion);
router.delete('/:id', authenticateAdmin, deleteQuestion);

export default router;
