# generator-digashopware
since we always create and copy the same files for new shopware projects, themes or apps, we have built a simple generator for ourselves. This is now to be gradually expanded with useful generators for shopware 6 development.

## Getting Started

- Dependencies:
  - Node.js
  - Yeoman: `npm install -g yo`
  - VSCode extensions for devenv SFTP https://github.com/liximomo/vscode-sftp
- Install: 
    - `clone repo https://github.com/ditegra-GmbH/generator-digashopware`
    - `npm i`
    - `npm link`
- Run: `yo digashopware`

## development environment features

```
[projectname]*
│   [projectname].code-workspace
│   docker-compose.yml
|   README.md
│   digalocaldevcopy.sh
|   digacloneconfig.yaml
|
└───src/    
    |   messenger_consume.sh
    |   scheduled_task_run.sh
    |    
    |___config
         │
         └───packages/
             │  twig.yaml
             |  shopware.yaml
```

*projectname == docker container name!


## Usage
Create plugin: 
    yo digashopware

Create theme:
    yo digashopware:theme

prepare development environment:
    yo digashopware:devenv

## License
Copyright 2021 ditegra GmbH