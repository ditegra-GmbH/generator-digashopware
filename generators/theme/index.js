var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    async prompting() {

        this.answers = await this.prompt([
            {
                type: "input",
                name: "prefix",
                message: "your manufacturer prefix",
                store: true
            },
            {
                type: "input",
                name: "company",
                message: "company information for composer.json",
                store: true
            },
            {
                type: "input",
                name: "manufacturerLink",
                message: "manufacturer link for composer.json",
                store: true
            },
            {
                type: "input",
                name: "supportLink",
                message: "support link for composer.json",
                store: true
            },
            {
                type: "input",
                name: "name",
                message: "your theme name (without prefix please)"
            },
            {
                type: "input",
                name: "description",
                message: "provide a short theme description"
            }
        ]);
    }

    writing() {
        let name = this.answers.name;
        let themeName = this.answers.prefix + name;
        let ourContextRoot = this.contextRoot; // this.options.callerPath;
        // this.destinationRoot(this.options.callerPath);
        this.log(ourContextRoot);
        
        /*
         * Root Theme Folder
         */
        this.fs.copyTpl(
            this.templatePath('composer.json'),     
            this.destinationPath(ourContextRoot + '/' + themeName + '/composer.json'),
            { 
                prefix: this.answers.prefix,
                company: this.answers.company,
                shortname: name.toLowerCase(),
                name: themeName,
                description: this.answers.description,
                manufacturerLink: this.answers.manufacturerLink,
                supportLink: this.answers.supportLink
            }
        );
        let path = ourContextRoot + '/' + themeName;
        this.fs.copyTpl(
            this.templatePath('README.md'),            
            this.destinationPath(ourContextRoot + '/' + themeName + '/README.md'),
            { 
                shortname: name,
            }
        );
        this.fs.copyTpl(this.templatePath('CHANGELOG.md'), this.destinationPath(ourContextRoot + '/' + themeName + '/CHANGELOG.md'));
        this.fs.copyTpl(this.templatePath('.gitignore'), this.destinationPath(ourContextRoot + '/' + themeName + '/.gitignore'));
        
        /*
         * src
         */
        path = path + '/src/';
        this.fs.copyTpl(
            this.templatePath('src/DigaGeneratorTheme.php'),
            this.destinationPath(path + themeName + '.php'),
            { 
                name: themeName,
            }
        );

        /*
         * src/Resources
         */
        path = path + 'Resources/';
        this.fs.copyTpl(
            this.templatePath('src/Resources/theme.json'),
            this.destinationPath(path + 'theme.json'),
            { 
                name: themeName,
                shortname: name.toLowerCase(),
                prefix: this.answers.prefix.toLowerCase(),
                company: this.answers.company,
                description: this.answers.description
            }
        );
        
        /*
         * src/Resources/app/storefront   dist & src
         */
        let appdistpath = path + 'app/storefront/dist';
        this.fs.copy(this.templatePath('src/Resources/app/storefront/dist/assets/theme-preview.png'), this.destinationPath(appdistpath + '/assets/theme-preview.png'));
        this.fs.copyTpl(this.templatePath('src/Resources/app/storefront/dist/storefront/js/diga-generator-theme.js'), this.destinationPath(appdistpath + '/storefront/js/diga-'+ name.toLowerCase() +'-theme.js'));

        let appsrcpath = path + 'app/storefront/src';
        this.fs.copyTpl(this.templatePath('src/Resources/app/storefront/src/main.js'), this.destinationPath(appsrcpath + '/main.js'));
        this.fs.copyTpl(this.templatePath('src/Resources/app/storefront/src/assets/.gitkeep'), this.destinationPath(appsrcpath + '/assets/.gitkeep'));

        this.fs.copyTpl(this.templatePath('src/Resources/app/storefront/src/scss/base.scss'), this.destinationPath(appsrcpath + '/scss/base.scss'));
        this.fs.copyTpl(this.templatePath('src/Resources/app/storefront/src/scss/overrides.scss'), this.destinationPath(appsrcpath + '/scss/overrides.scss'));
        this.fs.copyTpl(this.templatePath('src/Resources/app/storefront/src/scss/layout/_header.scss'), this.destinationPath(appsrcpath + '/scss/layout/_header.scss'));

        /*
         * src/Resources/config/
         */
        let configpath = path + 'config/';
        this.fs.copy(this.templatePath('src/Resources/config/plugin.png'), this.destinationPath(configpath + 'plugin.png'));
        this.fs.copyTpl(this.templatePath('src/Resources/config/services.xml'), this.destinationPath(configpath + 'services.xml'));
        this.fs.copyTpl(this.templatePath('src/Resources/config/config.xml'), this.destinationPath(configpath + 'config.xml'));        

        /*
         * src/Resources/snippet/
         */
        let snippetpath = path + 'snippet/';
        this.fs.copyTpl(this.templatePath('src/Resources/snippet/de_DE/storefront.de-DE.json'), this.destinationPath(snippetpath + 'de_DE/storefront.de-DE.json'),
        { 
            shortname: name.toLowerCase(),
            prefix: this.answers.prefix.toLowerCase()

        });
        this.fs.copyTpl(this.templatePath('src/Resources/snippet/en_GB/storefront.en-GB.json'), this.destinationPath(snippetpath + 'en_GB/storefront.en-GB.json'),
        { 
            shortname: name.toLowerCase(),
            prefix: this.answers.prefix.toLowerCase()
        });

        /*
         * src/Resources/views/
         */
        let viewspath = path + 'views/';
        this.fs.copyTpl(this.templatePath('src/Resources/views/storefront/base.html.twig'), this.destinationPath(viewspath + 'storefront/base.html.twig'),
        { 
            shortname: name.toLowerCase(),
            prefix: this.answers.prefix.toLowerCase()
        });
    }
};