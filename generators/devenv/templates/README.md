# local shopware 6 dev env with dockware.io 

- container: dockware.io
- host: windows 10
- system: shopware 6

---
**NOTE**

Please add new Hints, Tipps and possible Solutions not inside your project but inside the yo generator repo here: https://github.com/ditegra-GmbH/generator-digashopware 

---

## Problems and solutions

### After clone of shopware 6 system to local container bin/console leads to error: 
/usr/bin/env: 'php\r': No such file or directory

--- 
**Solution**

$ cd bin  
tr -d '\015' <console >console.new  
mv console console.old  
mv console.new console  
Source: https://stackoverflow.com/questions/50789087/windows-10-docker-usr-bin-env-php-r-no-such-file-or-directory

---

### git zu lange namen


### copy symlinks

## VSCode 
### Extensions

### Symfony for VSCode spawn /usr/bin/php ENOENT
symfony-vscode.phpExecutablePath =>  C:\php\php-7.4.6-nts-Win32-vc15-x64\php.exe
