#!/bin/bash

parse_yaml() {
   local prefix=$2
   local s='[[:space:]]*' w='[a-zA-Z0-9_]*' fs=$(echo @|tr @ '\034')
   sed -ne "s|^\($s\)\($w\)$s:$s\"\(.*\)\"$s\$|\1$fs\2$fs\3|p" \
        -e "s|^\($s\)\($w\)$s:$s\(.*\)$s\$|\1$fs\2$fs\3|p"  $1 |
   awk -F$fs '{
      indent = length($1)/2;
      vname[indent] = $2;
      for (i in vname) {if (i > indent) {delete vname[i]}}
      if (length($3) > 0) {
         vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
         printf("%s%s%s=\"%s\"\n", "'$prefix'",vn, $2, $3);
      }
   }'
}

# example call
# ./digalocaldevcopy.sh [action] [dumpdb] [createdb] [fs] [fsmedia] [fsfull] [sysconfig] [clenup] (cleanup=no)

# clone database + createdb on target rsync plugins and change the shopware config
# ./digalocaldevcopy.sh create dumpdb=yes createdb=yes fs=yes fsmedia=no fsfull=no sysconfig=yes

# default values
action=""
option=""
dumpname=""

# read yaml file
eval $(parse_yaml digacloneconfig.yaml "config_")

echo $config_source_shopDomain

# source shop configuration
shopDomain=$config_source_shopDomain
host=$config_source_dbHost
port=$config_source_dbPort
user=$config_source_dbUser
psw=$config_source_dbPsw
sourceDB=$config_source_sourceDbName
sshhost=$config_source_sshhost
sshpsw=$config_source_sshpsw
sshport=$config_source_sshport
saleschannelId=$config_source_saleschannelId
ignoreTableData=$config_source_ignoreTableData
# --ignore-table-data=$sourceDB.increment
# --ignore-table-data=$sourceDB.elasticsearch_index_task
# --ignore-table-data=$sourceDB.log_entry
# --ignore-table-data=$sourceDB.notification
# --ignore-table-data=$sourceDB.payment_token
# --ignore-table-data=$sourceDB.refresh_token
# --ignore-table-data=$sourceDB.version
# --ignore-table-data=$sourceDB.version_commit
# --ignore-table-data=$sourceDB.version_commit_data
# --ignore-table-data=$sourceDB.webhook_event_log
rsyncExcludeFiles=$config_source_rsyncExcludeFiles
# end source shop configuration

# target shop configuration
targetShopDomain=$config_target_targetShopDomain
targetDbHost=$config_target_targetDbHost
targetDbName=$config_target_targetDbName
targetDbPort=$config_target_targetDbPort
targetDbUser=$config_target_targetDbUser
targetDbPswd=$config_target_targetDbPswd
licenseHost=$config_target_licenseHost
targetUserPass=$config_target_targetUserPass
# end target configuration

# Options variables (default values)
db="false"
fs="false"
fsmedia="false"
fsfull="false"

# Arguments
action=$1
dumpdb=$2
createdb=$3
fs=$4
fsmedia=$5
fsfull=$6
sysconfig=$7

# Colors
Green=$'\e[1;32m'
Red=$'\e[1;31m'
Blue=$'\e[1;34m'
endcolor=$'\e[0m'

# Check if all arguments are there (-o is OR, -z is empty check)
#if [ -z "$1" -o -z "$2" -o -z "$3" -o -z "$4" -o -z "$5" -o -z "$6" -o -z "$7" -o -z "$8" ]
if [ -z "$1" -o -z "$2" -o -z "$3" -o -z "$4" -o -z "$5" -o -z "$6" -o -z "$7" ]
then
    echo "${Red}Some arguments are missing! (required arguments: action( create|update) clonedb (yes/no), files (custom/plugins, public/bundles), filesmedia (media folder and thumbnails), fullfilessysnc (rsync all files) $endcolor"
    exit 0
else
    echo "$Green Arguments collected successfully :) $endcolor"
fi

if [ $dumpdb == "dumpdb=yes" ] 
then   
    #Prepare name of the target DB with date (ddmmyyyy)
    dumpname="$sourceDB$(date +%d%m%Y)"
    dumpnameshema="$sourceDB$(date +%d%m%Y)-shema.sql"

    #dump of the wanted DB
    #1) just shema with all tables
    mysqldump -P $port -h $host -u $user -p$psw --no-data --lock-tables=false --no-tablespaces $sourceDB > "$dumpnameshema"
    echo "check $dumpnameshema is created and not null"
    if [[ -s $dumpnameshema ]]
    then
        echo "$dumpnameshema created and is not empty"
    else
        echo "${Red}mysqldump failed? $dumpnameshema is empty $endcolor"
        exit 0
    fi
    
    #2) data but ignore tables from ignore list
    mysqldump -P $port -h $host -u $user -p$psw --lock-tables=false --no-tablespaces $ignoreTableData $sourceDB > $dumpname.sql

    # check if the dump is > 0 if not then stop
    filename="$dumpname.sql"
    echo "check $filename is created and not null"
    if [[ -s $filename ]]
    then
        echo "$dumpname created and is not empty"
    else
        echo "${Red}mysqldump failed? $dumpname is empty $endcolor"
        exit 0
    fi
        
    if [ -z $targetDbName ] 
    then 
        targetDbName=$dumpname
        echo "set targetDbName to $dumpname"
    fi

    #create Database in localhost/adminer.php
    # -e is short for --execute=statement    
    if [ $createdb == "createdb=yes" ] 
    then
        mysql -h $targetDbHost -u root -proot -e "CREATE DATABASE $targetDbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
        echo "${Green}$targetDbName $endcolor DB created!"
    fi   

    # here we now change the user to target user@
    # sed -i 's/[THIS]/[THAT]/g' [file]
    sed -i "s/$user/$targetDbUser/g" $dumpname.sql

    # here we modify the mysql dump to be localhost or target system configured
    # import dump to a local db first the shema then the data
    echo "import $dumpnameshema > $targetDbName"
    mysql -h $targetDbHost -u $targetDbUser -p$targetDbPswd $targetDbName < $dumpnameshema

    echo "import $dumpname.sql > $targetDbName"
    mysql -h $targetDbHost -u $targetDbUser -p$targetDbPswd $targetDbName < $dumpname.sql

    echo "Dump import - $Green success $endcolor!"
    if [ $action == "create" -o $action == "CREATE" ]
    then
        echo "change db inside .env file  check the host and pass if you are on a testenv!"
        sed -i "s/shopware/$targetDbName/" ./.env

        echo "set SHOPWARE_CDN_STRATEGY_DEFAULT"

        echo 'SHOPWARE_CDN_STRATEGY_DEFAULT="id"' >> ./.env
        
        echo "${Green}.env file changed! :) $endcolor"

    else
        # Set new DB in .env file
        echo $Blue"> Type currently used DB name in your localhost?"$endcolor
        read currentdb
        sed -i "s/$currentdb/$targetDbName/" ./.env
        echo "${Green}.env file changed! :) $endcolor"
    fi
else
    echo "skip db creation"
fi

if [ $fs == "fs=yes" ]
then
    #rsync custom/plugins
    sshpass -p$sshpsw  rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -av --stats ${sshhost}custom/plugins/* custom/plugins
    echo "custom/plugins folder synced"

    #rsync custom/apps
    sshpass -p$sshpsw  rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -av --stats ${sshhost}custom/apps/* custom/apps
    echo "custom/apps folder synced"

    #rsync public/bundles
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -av --stats ${sshhost}public/bundles/* public/bundles
    echo "public/bundles folder synced"
fi

if [ $fsmedia == "fsmedia=yes" ]
then
    #rsync media
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx --stats ${sshhost}public/media/* public/media
    echo "public/media folder synced with meta"

    #rsync thumbnails
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx --stats ${sshhost}public/thumbnail/* public/thumbnail
    echo "public/thumbnail folder synced with meta"
fi

if [ $fsfull == "fsfull=yes" ]
then
    #rsync full system
    echo "rsync all shopware files"
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx --stats ${sshhost}bin bin
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx --stats ${sshhost}config config
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx --stats ${sshhost}custom custom
    #sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx --stats ${sshhost}files files
    #sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx --stats ${sshhost}logs logs
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx --stats ${sshhost}public public
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx --stats ${sshhost}src src
    #sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx --stats ${sshhost}var var
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx --stats ${sshhost}vendor vendor

	#sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx ${sshhost}.env .
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx ${sshhost}composer.json .
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx ${sshhost}composer.lock .
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx ${sshhost}Dockerfile .
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx ${sshhost}easy-coding-standard.php .
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx ${sshhost}index.html .
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx ${sshhost}install.lock .
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx ${sshhost}license.txt .
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx ${sshhost}phpstan.neon .
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx ${sshhost}phpunit.xml.dist .
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx ${sshhost}PLATFORM_COMMIT_SHA .
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx ${sshhost}psalm.xml .
    sshpass -p$sshpsw rsync -e "ssh $sshport -o StrictHostKeyChecking=no" -avx ${sshhost}README.md .
    echo "shopware root folder synced"
fi

if [ $action == "create" ]
then
    #create user: diga
    bin/console user:create --admin --email="digadev$(date +%d%m%Y)@ditegra.de" --firstName="Diga" --lastName="Dev" --password=$targetUserPass --no-interaction diga-local
fi

if [ $sysconfig == "sysconfig=yes" ]
then
    # system_config    
    echo "system:config:set -s $saleschannelId core.mailerSettings.emailAgent to local"
    bin/console system:config:set core.mailerSettings.emailAgent local
    
    echo "system:config:set core.store.licenseHost to $licenseHost"
    bin/console system:config:set core.store.licenseHost $licenseHost
       
    echo "sales-channel:update:domain --previous-domain=$shopDomain $targetShopDomain"
    bin/console sales-channel:update:domain --previous-domain=$shopDomain $targetShopDomain    

    bin/console app:url-change:resolve reinstall-apps
    bin/console assets:install
    bin/console theme:compile

    bin/console cache:clear
fi

echo "${Green}Done - Congratulations :D$endcolor"