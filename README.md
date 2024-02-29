<img width="80" align="left" src='https://github.com/KokosTech/lenslend-frontend/assets/46886807/25c0a9f0-b454-46dd-80dd-48ecc83b86bf' />

# lenslend-backend

The backend (API) of a Technology School Electronic Systems thesis project made by Kaloyan Doychinov, class 2024

<p align="center">
  <img src='https://repobeats.axiom.co/api/embed/a3ce9e5eb1f077f9057a2726da937eb6085964fd.svg' alt="Repobeats analytics image" />
</p>

***LensLend*** is an innovative web application designed to facilitate digital content creators by providing a platform for selling and buying, renting and lending recording equipment and offering locations for shoots. Catering to the needs of those involved in video and podcast production, it aims to enhance the quality of content creation by making it easier to access the right technology and ideal settings. Accessible from any device, LensLend serves as a dynamic solution for creators seeking to produce high-quality digital content for platforms like YouTube, Instagram, and TikTok.

[![wakatime](https://wakatime.com/badge/user/f3786457-e08f-4d45-b593-cd8517eacd90/project/018c4172-5fb0-4ad6-a0de-f495db6cab27.svg)](https://wakatime.com/badge/user/f3786457-e08f-4d45-b593-cd8517eacd90/project/018c4172-5fb0-4ad6-a0de-f495db6cab27)

## Getting Started

Firstly, install all dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, create a `.env` file and use the following template from `.env.template`

```env
DATABASE_URL="<schema>://<username>:<password>@<host>:<port>/<database>?schema=public&pool_timeout=15&connection_limit=5"

JWT_SECRET=<LONG_SECRET>
JWT_EXPIRES_IN="1h"
JWT_REFRESH_SECRET=<DIFFERENT_LONG_SECRET>
JWT_REFRESH_EXPIRES_IN="7d"

# REDIS
REDIS_URL="redis://default:<password>@<host>:<port>"
REDIS_USERNAME="default"
REDIS_PASSWORD=<PASSWORD>
REDIS_NAME="lenslend"
REDIS_DATABASE="0"

# AWS
AWS_S3_REGION=<REGION>
AWS_ACCESS_KEY_ID=<AWS_ACCESS_KEY>
AWS_SECRET_ACCESS_KEY=<AWS_SECRET_KEY>

AWS_S3_BUCKET_NAME="lenslend"
AWS_S3_FOLDER="og"

AWS_CLOUDFRONT_URL=<CLOUDFRONT_URL>

NODE_ENV="development"
VERSION="0.0.1"
```

And lastly, run the application:

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

## Test

```bash
# unit tests
$ pnpm test

# e2e tests
$ pnpm test:e2e

# test coverage
$ pnpm test:cov
```

## Other Repos for LensLend

- Frontend (Web) - https://github.com/KokosTech/lenslend-frontend

<br/>

*Created by [Kaloyan Doychinov](https://kaloyan.tech/), Technology School Electronic Systems*

