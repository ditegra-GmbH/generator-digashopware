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

### Issue git Filename too long 
git config --system core.longpaths true
https://stackoverflow.com/questions/22575662/filename-too-long-in-git-for-windows

### copy symlinks
Use a FTP client!

## VSCode 
### Extensions
https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug
https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client
https://marketplace.visualstudio.com/items?itemName=MehediDracula.php-namespace-resolver
https://marketplace.visualstudio.com/items?itemName=liximomo.sftp
https://marketplace.visualstudio.com/items?itemName=mblode.twig-language-2

https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome
https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens

https://marketplace.visualstudio.com/items?itemName=ritwickdey.create-file-folder
https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense

### Symfony for VSCode spawn /usr/bin/php ENOENT
symfony-vscode.phpExecutablePath =>  C:\php\php-7.4.6-nts-Win32-vc15-x64\php.exe
