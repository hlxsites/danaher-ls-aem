## Build

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

The app uses [dotenv](https://www.npmjs.com/package/dotenv) to read environment configurations for `AEM_HOST`, `AEM_USER`, `AEM_PASSWORD` and `AEM_WCMMODE`.

The node process can be debugged using for example the Chrome developer tools. Source maps are available.

To test the converter run:

```
curl http://localhost:3030/index.md?wcmmode=disabled
```
