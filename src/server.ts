import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import {PORT} from "./utils/config";
import morgan from "morgan";
import authRoutes from './routes/authRoutes';
import newsletterRoutes from "./routes/newsletterRoutes";
import publishingRoutes from "./routes/publishingRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";

const init = async () => {
    dotenv.config();

    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(morgan('dev'));

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/newsletters', newsletterRoutes);
    app.use('/api/posts', publishingRoutes);
    app.use('/api/subscriptions', subscriptionRoutes);



    // Start server
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

init();