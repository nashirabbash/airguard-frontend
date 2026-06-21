import pino from "pino";

export const logger = pino({
  level: import.meta.env.DEV ? "debug" : "info",
  browser: {
    asObject: true,
  },
  base: {
    service: "airguard-frontend",
    env: import.meta.env.MODE,
  },
  formatters: {
    level(label) {
      return { level: label };
    },
  },
});
