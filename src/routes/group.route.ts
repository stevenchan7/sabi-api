import { Router } from 'express';
import { createGroup, deleteGroup, editGroup, getGroupById, getGroups } from '../controller/group.controller';
import { authenticateAdmin, authenticateStudent } from '../middlewares/auth.middleware';
import { validate } from '../helpers/validation.helper';
import { createGroupValidationRules, editGroupValidationRules } from '../validation/group.validation';
import { getQuestionsByGroupId } from '../controller/question.controller';
import { upload } from '../config/multer.config';

const router = Router();

router.get('/', authenticateStudent, getGroups);
router.get('/:id/quizes', authenticateAdmin, getQuestionsByGroupId);
router.get('/:id', authenticateStudent, getGroupById);
router.post('/', authenticateAdmin, upload.single('thumbnail'), createGroupValidationRules, validate, createGroup);
router.put('/:id', authenticateAdmin, upload.single('thumbnail'), editGroupValidationRules, validate, editGroup);
router.delete('/:id', authenticateAdmin, deleteGroup);

export default router;
