import express from 'express';

import ItemController from '../controllers/ItemController';

const routes = express.Router();
const itemController = new ItemController();

routes.get('/items', itemController.index);

export default routes;