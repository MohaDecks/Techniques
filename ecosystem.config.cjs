const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const logsDir = path.join(rootDir, "logs");

function loadEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;

  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const env = {
  ...loadEnvFile(path.join(rootDir, ".env")),
  ...loadEnvFile(path.join(rootDir, ".env.local")),
};

const customerUrl =
  env.NEXT_PUBLIC_CUSTOMER_URL || "https://techcustomer.dirshay.com";
const adminUrl = env.NEXT_PUBLIC_ADMIN_URL || "https://techadmin.dirshay.com";

const sharedEnv = {
  ...env,
  NODE_ENV: "production",
  NEXT_PUBLIC_CUSTOMER_URL: customerUrl,
  NEXT_PUBLIC_ADMIN_URL: adminUrl,
};

module.exports = {
  apps: [
    {
      name: "techni-customer",
      cwd: path.join(rootDir, "apps/customer"),
      script: "npm",
      args: "run start",
      interpreter: "none",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      time: true,
      max_restarts: 20,
      min_uptime: "5s",
      restart_delay: 2000,
      max_memory_restart: "500M",
      error_file: path.join(logsDir, "customer-error.log"),
      out_file: path.join(logsDir, "customer-out.log"),
      merge_logs: true,
      env: {
        ...sharedEnv,
        PORT: "1010",
      },
    },
    {
      name: "techni-admin",
      cwd: path.join(rootDir, "apps/admin"),
      script: "npm",
      args: "run start",
      interpreter: "none",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      time: true,
      max_restarts: 20,
      min_uptime: "5s",
      restart_delay: 2000,
      max_memory_restart: "500M",
      error_file: path.join(logsDir, "admin-error.log"),
      out_file: path.join(logsDir, "admin-out.log"),
      merge_logs: true,
      env: {
        ...sharedEnv,
        PORT: "2020",
      },
    },
  ],
};
