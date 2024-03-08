import express from 'express';
import {
  checkToken,
  userDelete,
  userGet,
  userListGet,
  userPost,
  userPut,
  userAddCategory,
  userCategoriesGet,
  userRemoveCategory
} from '../controllers/userController';
import {authenticate} from '../../middlewares';

const router = express.Router();

router
  .route('/')
  .get(userListGet)
  .post(userPost)
  .put(authenticate, userPut)
  .delete(authenticate, userDelete);

router.get('/token', authenticate, checkToken);

router
  .route('/:id/categories')
  .get(userCategoriesGet)
  .post(authenticate, userAddCategory)
  .delete(authenticate, userRemoveCategory);

router
  .route('/:id')
  .get(userGet)
  .delete(authenticate, userDelete)
  .put(authenticate, userPut);

export default router;
