# TraCAD - Country Portal Service

##### Backend service for ICAT Climate Action Assessment Tool for Transport Sector - TraCAD. 

<p align="center"></p>
<p align="center">
  <a href="https://climateactiontransparency.org/" target="blank"><img src="https://climateactiontransparency.org/wp-content/themes/custom/assets/i/logo/logo_text.svg" width="320" alt="ICAT Logo" /></a>
</p>
<p align="center">Suported by <a href="https://climateactiontransparency.org/" target="_blank">Initiative for Climate Action Transparency - ICAT</a>.</p>
<p align="center">
<p align="center"></p>
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /><a>
</p>
<p align="center">Built using <a href="http://nestjs.com/" target="_blank">Nest</a>: a progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
<p align="center"></p>

## Local Manual Installation

1. Download and install the [Node.js 18 LTS version](https://nodejs.org/en/download) for your operational system. 

2. Download or clone this repository.

3. In the terminal, go to this repository main folder.

4. Install the NPM dependencies (including Nest) with the command:

```bash
$ npm install --force
```

5. Set up the Environment Variables
    * Windows: using `set` command in the terminal
    * Linux/MacOS: using `export` command in the terminal

6. Running the app:

```bash
$ npm run start
```

## Google Cloud Installation with Docker

1. In GCP Console, enable the Artifact Registry API

2. Go to [Artifact Registry](https://console.cloud.google.com/artifacts) and create a new repository:
    * Format: Docker
    * Type: Standard
    * Location: desired application location
    * Encryption: Google-managed key

3. Download and install [gcloud CLI](https://cloud.google.com/sdk/docs/install).

4. Download or clone this repository.

5. In the terminal, go to this repository main folder.

6. Build your container in Artifacts Register using the provided `Dockerfile`. Usually the container path is compose by `location/project/repository_created/image_name`
```bash
$ gcloud builds submit --tag [ADD THE CONTAINER PATH HERE]
```

7. Go to [Cloud Run](https://console.cloud.google.com/run) and create a New Service:
    * Choose the option `Deploy one revision from an existing container image` and select the container image updated in the step 6
    * Add a service name
    * Select the application region
    * Select `Allow unauthenticated invocations` in Authentication option
    * In Container, Networking, Security section

> Noticed that some [special permissions in GCP](https://cloud.google.com/run/docs/reference/iam/roles#additional-configuration) can be necessary to perform this task.

## Environment Variables 

The environment variables should be declared 

| Variable name            | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `SOCKET_PATH`            | Database Socket Path                               |
| `DATABASE_PORT`          | Database Port                                      |
| `DATABASE_USER`          | Database Socket User                               |
| `DATABASE_PASSWORD`      | Database Password                                  |
| `DATABASE_NAME`          | Database Name                                      |
| `BASE_URL`               | Current Application URL                            |
| `CLIENT_URL`             | Country Service Web URL                            |
| `PWD_RESET_URL`          | Country Service Web URL + `/login`                 |
| `CAL_ENGINE_BASE_URL`    | Calculation Engine URL                             |
| `API_KEY_1`              | API key. Should be the same as used by clients     |
| `API_KEY_2`              | API key. Should be the same as used by clients     |

## API Documentation
After the application install, the API Documentation is available in the application URL + `/api/` with [Swagger](https://swagger.io/solutions/api-documentation/).


## License
TraCAD - CountryPortalService is [MIT licensed](LICENSE).

