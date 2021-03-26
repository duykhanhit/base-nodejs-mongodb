module.exports = {
  apps: [
    {
      name: "Base API",
      script: "app.js",
      watch: true,
      autorestart: true,
      env: {
        NODE_ENV: "development",
        PORT: 5000,
        MONGO_URI: "",
        JWT_SECRET: "",
        JWT_EXPIRE: 86400000,
        JWT_COOKIE_EXPIRE: 1,
        USER_EMAIL: "",
        PASSWORD_EMAIL: "",
        PAGE: 1,
        LIMIT: 10,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
        MONGO_URI: "",
        JWT_SECRET: "",
        JWT_EXPIRE: 86400000,
        JWT_COOKIE_EXPIRE: 1,
        USER_EMAIL: "",
        PASSWORD_EMAIL: "",
        PAGE: 1,
        LIMIT: 10,
      },
    },
  ],

  // deploy: {
  //   production: {
  //     user: 'user',
  //     host: 'ip',
  //     ref: 'origin/master',
  //     repo: 'git@github.com:repo.git',
  //     path: '/var/www/production',
  //     'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
  //   }
  // }
};
