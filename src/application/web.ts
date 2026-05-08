import express from "express";
import publicApi from "../route/public-api";
import api from "../route/api";
import { errorMiddleware } from "../middleware/error-middleware";

export const web = express();
web.use(express.json());

web.use("/api", publicApi);
web.use("/api", api);

web.use(errorMiddleware);
