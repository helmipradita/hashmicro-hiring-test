import express from "express";
import swaggerUi from "swagger-ui-express";
import publicApi from "../route/public-api";
import api from "../route/api";
import { errorMiddleware } from "../middleware/error-middleware";
import { swaggerSpec } from "./swagger";

export const web = express();
web.use(express.json());

web.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Swagger UI
web.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// JSON spec endpoint (optional, for importing to Postman etc.)
web.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

web.use("/api", publicApi);
web.use("/api", api);

web.use(errorMiddleware);
