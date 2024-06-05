const validateEnv = (env: string) => {
  if (!env) {
    throw new Error('Environment variable is not set');
  }
};

export const getEnv = (env: string) => {
  validateEnv(env);
  return process.env[env];
};
