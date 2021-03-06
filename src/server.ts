import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import registerRoutes from './routes';

// initialize configuration
dotenv.config();

const app = express();
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.get('/', (req, res) => {
  res.status(200).send(`${process.env.WELCOME_MESSAGE} - v.${process.env.npm_package_version}`);
});

// Configure routes
const router = express.Router();
registerRoutes(router);
app.use('/v1', router);

export default app;
