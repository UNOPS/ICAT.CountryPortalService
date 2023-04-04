## Country Portal Service

Backend service for ICAT Climate Action Assessment Tool. Suported by [Initiative for Climate Action Transparency - ICAT](https://climateactiontransparency.org/).
Built using [Node.js 18](https://nodejs.org/dist/latest-v18.x/docs/api/) and [Nest](https://github.com/nestjs/nest) framework.

## Installation

```bash
$ npm install --force
```

## Environment Variables 

SOCKET_PATH	/cloudsql/unops-cpit-icat-prod:europe-west3:icat-qa	
DATABASE_PORT	3306	
DATABASE_USER	root	
DATABASE_PASSWORD	9?6h>DeF=H|52uBf	
DATABASE_NAME	icat_country	
BASE_URL	https://icat-countryportalservice-qa-2sshj5de3a-ey.a.run.app	
CLIENT_URL	https://icat-countryportalweb-qa-2sshj5de3a-ey.a.run.app	
PWD_RESET_URL	https://icat-countryportalweb-qa-2sshj5de3a-ey.a.run.app/login	
CAL_ENGINE_BASE_URL	https://icat-calculationengine-qa-2sshj5de3a-ey.a.run.app	
API_KEY_1	1234	
API_KEY_2	56789

## Running the app

```bash
$ npm run start

```

## License

CountryPortalService is [MIT licensed](LICENSE).
