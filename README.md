# Your Project's Title...
Your project's description...

## Environments
- Preview: https://main--danaher-ls-aem--hlxsites.hlx.page/
- Live: https://main--danaher-ls-aem--hlxsites.hlx.live/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development

### Franklin

1. Create a new repository based on the `helix-project-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [helix-bot](https://github.com/apps/helix-bot) to the repository
1. Start Franklin Proxy and necessary file watchers: `npm run dev` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
1. To build the css bundle priot to a commit, run `npm run build:css`
1. Install the [Helix CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/helix-cli`
1. Start Franklin Proxy: `hlx up` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)


### Worker

1. To run the worker locally: `npm run dev:worker`
2. To deploy the worker to Cloudflare: `npm run deploy:worker`