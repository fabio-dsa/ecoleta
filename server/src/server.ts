import express from 'express';
import cors from "cors";

import { errors } from 'celebrate';

import ImageRoutes from './routes/imageRoutes';
import ItemsRoutes from './routes/itemsRoutes';
import PointsRoutes from './routes/pointsRoutes'

const app = express();

app.use(express.json());
app.use(cors());

app.use(ImageRoutes);
app.use(ItemsRoutes);
app.use(PointsRoutes)

app.use(errors());

app.listen(3333);