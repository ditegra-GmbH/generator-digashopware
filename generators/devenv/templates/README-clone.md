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


## on host environment

    docker cp digalocaldevcopy.sh <%= containername %>:/var/www/html   
    docker exec -d <%= containername %> sudo chown -R www-data:www-data /var/www/html/digalocaldevcopy.sh
    docker exec -d <%= containername %> sudo chmod 775 www-data:www-data /var/www/html/digalocaldevcopy.sh
            
    docker exec -d <%= containername %> touch /var/www/html/digacloneconfig.yaml
    docker exec -d <%= containername %> sudo chown -R www-data:www-data /var/www/html/digacloneconfig.yaml    
    docker exec -d <%= containername %> sudo chmod 775 www-data:www-data /var/www/html/digacloneconfig.yaml    

optional 

    docker cp digaclonerepos.sh <%= containername %>:/var/www/html
    docker exec -d <%= containername %> sudo chown -R www-data:www-data /var/www/html/digaclonerepos.sh
    docker exec -d <%= containername %> sudo chmod 775 www-data:www-data /var/www/html/digaclonerepos.sh    

## inside container
install base shopware 6 version

    bin/console system:setup

follow the instructions to create the env file!

    bin/console system:install --shop-name=<%= containername %> --shop-email=digadev@ditegra.de --shop-locale=de-DE --shop-currency=EUR


# IMPORTANT: copy data from lastpass to digacloneconfig.yaml
    
    ./digalocaldevcopy.sh create dumpdb=yes createdb=yes fs=yes fsmedia=no fsfull=no sysconfig=yes

Now login and change saleschannel from https to http

done :)

## Error: /bin/bash^M: bad interpreter: No such file or directory
fix by running:    

    sed -i -e 's/\r$//' digalocaldevcopy.sh

## Error SecurityPlugin: remove the security plugin folder and run 

    ./digalocaldevcopy.sh create dumpdb=no createdb=no fs=no fsmedia=no fsfull=no sysconfig=yes


## VS Code Extensions
https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug
https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client
https://marketplace.visualstudio.com/items?itemName=MehediDracula.php-namespace-resolver
https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers