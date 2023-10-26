# Danaher Life Sciences AEM site

## Environments
- Preview: https://main--danaher-ls-aem--hlxsites.hlx.page/
- Live: https://main--danaher-ls-aem--hlxsites.hlx.live/
- Public: https://stage.lifesciences.danaher.com/

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Development and Branch Process
The requestor will create a Zoho request or a new GitHub issue in the hlxsites/danaher-ls-aem repository. 
If this is a code or configuration change, then from the Zoho request/GitHub issue a branch will be created with the following structure: 

<type>-<id>- <short issue name> 

As an example:

feat-30-integrate-accessible 

The following options can be selected as the type: 

Feat (new feature or enhancement) 
Fix (bug fix) 

The short issue name must not be more than 15 characters long. 

## Local development

### Franklin

1. Create a new repository based on the `helix-project-boilerplate` template and add a mountpoint in the `fstab.yaml`
1. Add the [helix-bot](https://github.com/apps/helix-bot) to the repository
1. Start Franklin Proxy and necessary file watchers: `npm run dev` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
1. To build the css bundle priot to a commit, run `npm run build:css`
1. Install the [Helix CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/helix-cli`
1. Start local development environment: `npm run dev` (opens your browser at `http://localhost:3000`)
1. Open the `{repo}` directory in your favorite IDE and start coding :)
