import express from 'express';
import path from 'path'

const routes = express.Router();

routes.use('/uploads', express.static(path.resolve(__dirname, '..', '..', 'uploads')));

export default routes;