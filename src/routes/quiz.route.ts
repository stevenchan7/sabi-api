import { Router } from 'express';
import { authenticateStudent } from '../middlewares/auth.middleware';
import { createUserAnswerGroup, getUserAnswerGroupById, submitQuiz } from '../controller/quiz.controller';

const router = Router();

// Get user answer group quizes
router.get('/user-answer-groups/:id', authenticateStudent, getUserAnswerGroupById);
// Create user answer group
router.post('/user-answer-groups', authenticateStudent, createUserAnswerGroup);
// Quiz submission
router.patch('/user-answer-groups/:id', authenticateStudent, submitQuiz);

export default router;
