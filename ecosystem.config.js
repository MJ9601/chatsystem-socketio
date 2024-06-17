module.exports = {
  apps: [
    {
      name: 'manshor-app',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        SERVER_PORT: process.env.PORT,
        JWT_SECRET: 'secret',
        SECRET: 'secret',
        NODE_ENV: 'development',

        POSTGRES_URL: 'postgres://postgres:password@postgres_db:5432/manshor',
        POSTGRES_USER: 'postgres',
        POSTGRES_PASSWORD: 'password',
        POSTGRES_DB: 'manshor',
        POSTGRES_HOST: 'postgres_db',
        POSTGRES_HOST_DEV: 'localhost',
        POSTGRES_PORT: 5432,
      },
      env_production: {
        NODE_ENV: 'production',
        POSTGRES_USER: 'postgres',
        POSTGRES_PASSWORD: 'password',
        POSTGRES_DB: 'manshor',
        POSTGRES_HOST: 'postgres_db',
        POSTGRES_HOST_DEV: 'localhost',
        POSTGRES_PORT: 5432,
        POSTGRES_URL: 'postgres://postgres:password@postgres_db:5432/manshor',
      },
    },
  ],
};
