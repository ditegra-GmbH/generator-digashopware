# generator-digashopware
## Install
    clone repo https://dev.azure.com/ditegrase/Diga%20Tools/_git/generator-digashopware
    npm i
    npm link

? npm install --global yo generator-digashopware

## Usage

Create diga plugin: 

    yo digashopware

Create diga Theme:

    yo digashopware:theme

Add files needed for development environment:

    yo digashopware:devenv


# Local DEV ENV Erstellen
1) unter repos einen neuen folder z.B. loregi
2) File docker-compose.yml  mit angepasstem => container_name: loregi
3) src Ordner erstellen
4) create loregi.code-workspace 
5) create .vscode folder inside src/.vscode
	.vscode with Files: sftp.json & launch.json
6) 	create twig.yaml inside src\config\packages

## setup
docker-compose up -d
docker cp loregi:/var/www/html/. src\

if error: symlink ..\phpunit\phpunit\phpunit C:\repos\loregi\src\vendor\bin\phpunit: A required privilege is not held by the client.