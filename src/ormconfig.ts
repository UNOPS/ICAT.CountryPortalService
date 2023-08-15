import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  // type: 'mysql',
  // host: process.env.DATABASE_HOST,
  // socketPath: process.env.SOCKET_PATH,
  // port: Number(process.env.DATABASE_PORT),
  // username: process.env.DATABASE_USER,
  // password: process.env.DATABASE_PASSWORD,
  // database: process.env.DATABASE_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'pradeep123#',
    database: 'portelservice',


  synchronize: false,

  migrationsRun: true,
  logging: true,
  logger: 'file',

  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export = config;
