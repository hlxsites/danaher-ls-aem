## Build

Each action supports the default `npm run` commands to `build`, `test` and `serve`.

To build the action run 

```
npm run build
```

This will build in development mode. To build for production use

```
npm run build -- --mode production
```

## Development

To run the tests run

```
npm run test
```

To run the action locally run

```
npm run serve
```

That will build the action code inside an express app, with [src/express.js](src/express.js) as entry point watching any changes. In parallel it will run the webpack output in a self-restarting node process.

The express app listens on port 3030 and handles incoming requests for *.html and *.md files, applying the import.js transformations. 

The app uses [dotenv](https://www.npmjs.com/package/dotenv) to read environment configurations for `AEM_USER` and `AEM_PASSWORD`. For local development the `.env` file needs to be stored in the app root folder. The environment specific URLs for the AEM Author and Public are provided in the  [converter.yaml](./convert/converter.yaml).

The node process can be debugged using for example the Chrome developer tools. Source maps are available.

To test the converter run:

```
curl http://localhost:3030/index.md
```

## Deployment

The actions built and deployed by a [github workflow](../../.github/workflows/deploy-action-convert.yaml). Each converter related change to the main branch will automatically trigger a deployment of the action to the runtime IO.

To deploy the action manually use the App Builder CLI. The [Getting Started guide for AIO Runtime](https://developer.adobe.com/runtime/docs/guides/getting-started/setup/#creating-a-namespace-and-retrieving-the-credentials) provides detailed steps to setup a local environment. 

It is recommended to deploy the current work-in-progress into a separate package, e.g. using your username. To change the package name, modify the [app.config.yaml](./app.config.yaml).

```
aio app deploy
```

## Running

The runtime IO action is used by the AEM Franklin Admin service to pull the content from the AEM Author. The web action URL needs to be provided in the [fstab.yaml](../../fstab.yaml).

For example to pull the root page via the AEM Franklin API (preview operation) the following curl command can be used: 
```
curl --request POST \
  --url https://admin.hlx.page/preview/hlxsites/danaher-ls-aem/main/index.html \
  --header 'Authorization: [AUTH_TOKEN]'
```
The `[AUTH_TOKEN]` needs to be replaced with a Basic or Bearer authentication header token for the AEM Author. The configuration for the mapping from `index.html` to the AEM Author page located at `/content/danaher/ls/us/en.html` is done in the [paths.yaml](../../paths.yaml) file.
