const logger = require("../lib/logger");

const logRequest = (req, res, next) => {
  const start = Date.now();

  // İstek bilgilerini logla
  logger.info(`${req.method} ${req.url}`);
  logger.info(`Headers: ${JSON.stringify(req.headers)}`);
  logger.info(`Body: ${JSON.stringify(req.body)}`);

  // Response'un tamamını logla
  const oldWrite = res.write;
  const oldEnd = res.end;

  const chunks = [];

  res.write = (...args) => {
    chunks.push(Buffer.from(args[0]));
    oldWrite.apply(res, args);
  };

  res.end = (...args) => {
    if (args[0]) {
      chunks.push(Buffer.from(args[0]));
    }

    const body = Buffer.concat(chunks).toString("utf8");

    logger.info(`Status: ${res.statusCode}`);
    logger.info(`Headers: ${JSON.stringify(res.getHeaders())}`);
    logger.info(`Body: ${body}`);

    oldEnd.apply(res, args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`Request duration: ${duration}ms`);
  });

  next();
};

module.exports = logRequest;
