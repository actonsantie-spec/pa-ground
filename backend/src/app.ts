import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import { join } from 'path';
import routes from './routes/index.js';
import errorHandler from './utils/handleErrors.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
const swaggerDoc = YAML.load(join(__dirname, '../openapi.yaml'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use('/api', routes);

// serve uploaded files
app.use('/uploads', express.static('uploads'));

// global error handler
app.use(errorHandler);

export default app;
