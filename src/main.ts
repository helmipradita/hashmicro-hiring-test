import { web } from "./application/web";
import logger from "./application/logging";

const PORT = process.env.PORT || 3000;

web.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Access: http://localhost:${PORT}`);
});
