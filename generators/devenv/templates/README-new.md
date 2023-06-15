# <%= containername %> local dev env

## on host environment
clone repo to your machine e.g. c:\repos\

    docker-compose up -d

connect to container with VSCode and open terminal

    code <%= containername %>.code-workspace

## inside container

    rm -rf public

**To check shopware versions if needed!**

    composer show shopware/production --all

**install base shopware using composer change version to which you need**

    composer create-project shopware/production:v6.4.20.2 .

## create mysql DB for defaul installation

create manually via http://localhost/adminer.php
    
    CREATE DATABASE shopware utf8mb4_general_ci

or run

    docker exec -d <%= containername %> mysql -h localhost -u root -proot -e "CREATE DATABASE shopware COLLATE utf8mb4_general_ci"

## inside container
install base shopware 6 version

    bin/console system:setup

follow the instructions to create the env file!

    bin/console system:install --shop-name=<%= containername %> --shop-email=digadev@ditegra.de --shop-locale=de-DE --shop-currency=EUR

done :)

## VS Code Extensions
https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug
https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client
https://marketplace.visualstudio.com/items?itemName=MehediDracula.php-namespace-resolver
https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers