import { ConnectionOptions } from 'typeorm';
//https://github.com/ambroiseRabier/typeorm-nestjs-migration-example

//***********************************************************************//

// npm run typeorm:migrate <myEntity-migration>
// Check your migration queries in src/migrations
// npm run start:dev or npm run start:prod or npm run typeorm:run

///Do not use capital letters for db name if used migration will NOT WORK
//If migration not working please delete dist folder and retry
//***********************************************************************//

// You can load you .env file here synchronously using dotenv package (not installed here),
// import * as dotenv from 'dotenv';
// import * as fs from 'fs';
// const environment = process.env.NODE_ENV || 'development';
// const data: any = dotenv.parse(fs.readFileSync(`${environment}.env`));
// You can also make a singleton service that load and expose the .env file content.
// ...

// Check typeORM documentation for more information.
const config: ConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  // username: 'root',
  // password: '12345',
  //database: 'nccdsndb',
  username: 'root',
  password: '',
  database: 'portelservice',
  // password: '12345',
  // database: 'portelservice',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],

  // We are using migrations, synchronize should be set to false.
  synchronize: false ,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually .
  migrationsRun: false,
  logging: true,
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/migrations',
  },
};

export = config;
