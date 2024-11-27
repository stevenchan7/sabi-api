import { Router } from 'express';
import { createGroup, deleteGroup, editGroup, getGroupById, getGroups } from '../controller/group.controller';
import { authenticateAdmin } from '../middlewares/auth.middleware';
import { validate } from '../helpers/validation.helper';
import { createGroupValidationRules, editGroupValidationRules } from '../validation/group.validation';
import { getQuestionsByGroupId } from '../controller/question.controller';

const router = Router();

router.get('/', getGroups);
router.get('/:id/questions', getQuestionsByGroupId);
router.get('/:id', getGroupById);
router.post('/', authenticateAdmin, createGroupValidationRules, validate, createGroup);
router.put('/:id', authenticateAdmin, editGroupValidationRules, validate, editGroup);
router.delete('/:id', authenticateAdmin, deleteGroup);

export default router;