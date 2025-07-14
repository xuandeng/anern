module.exports = {
  apps: [
    {
      name: 'cms-system',
      script: 'npm',
      args: 'start',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // 日志配置
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // 进程管理
      kill_timeout: 3000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // 高级配置
      merge_logs: true,
      instance_var: 'INSTANCE_ID',
      
      // 健康检查
      health_check_url: 'http://localhost:3000/api/health',
      health_check_grace_period: 3000,
      
      // 内存和CPU限制
      max_restarts: 10,
      min_uptime: '10s',
      
      // 环境变量
      env_file: '.env.production'
    }
  ],

  // 部署配置
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:your-username/cms-system.git',
      path: '/var/www/cms-system',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'git clone git@github.com:your-username/cms-system.git /var/www/cms-system',
      'post-setup': 'ls -la'
    },
    staging: {
      user: 'deploy',
      host: ['staging-server.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:your-username/cms-system.git',
      path: '/var/www/cms-system-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging'
    }
  }
};