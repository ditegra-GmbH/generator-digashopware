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


# create local Shopware 6 / dockware DEV ENV
1) Inside you repos folder einen neuen folder z.B. mydevprj
2) File docker-compose.yml  mit angepasstem => container_name: mydevprj
3) create src folder
4) create mydevprj.code-workspace 
5) create .vscode folder inside src/.vscode
	.vscode with Files: sftp.json & launch.json
6) 	create twig.yaml inside src\config\packages

## setup
docker-compose up -d
docker cp mydevprj:/var/www/html/. src\

if error: symlink ..\phpunit\phpunit\phpunit C:\repos\mydevprj\src\vendor\bin\phpunit: A required privilege is not held by the client.

get all Files via a FTP Client of your choise