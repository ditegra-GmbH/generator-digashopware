var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    async prompting() {
        this.answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your Plugin Name, without Diga Prefix!"
            },
            {
                type: "input",
                name: "description",
                message: "plugin description"
            }
        ]);
    }

    writing() {
        let name = this.answers.name;
        let pluginName = "Diga" + name;

        // Move all the files and replace vars
        this.fs.copyTpl(
            this.templatePath('composer.json'),
            this.destinationPath(pluginName + '/composer.json'),
            { 
                shortname: name.toLowerCase(),
                name: pluginName,
                description: this.answers.description
            }
        );

        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath(pluginName + '/README.md'),
            { 
                shortname: name,
            }
        );
        this.fs.copyTpl(this.templatePath('CHANGELOG.md'), this.destinationPath(pluginName + '/CHANGELOG.md'));
        
        // Copy gulpfile from template folder
        this.fs.copyTpl(this.templatePath('gulpfile.js'), this.destinationPath(pluginName + '/gulpfile.js'));
        this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath(pluginName + '/package.json'));
        this.fs.copyTpl(this.templatePath('.gitignore'), this.destinationPath(pluginName + '/.gitignore'));
        
        //src Folder
        this.fs.copyTpl(
            this.templatePath('src/DigaShopwareGenerator.php'),
            this.destinationPath(pluginName + '/src/' + pluginName + '.php'),
            { 
                name: pluginName,
            }
        );
        this.fs.copyTpl(this.templatePath('src/Resources/config/config.xml'), this.destinationPath(pluginName + '/src/Resources/config/config.xml'));
        this.fs.copy(this.templatePath('src/Resources/config/plugin.png'), this.destinationPath(pluginName + '/src/Resources/config/plugin.png'));
        this.fs.copyTpl(this.templatePath('src/Resources/config/services.xml'), this.destinationPath(pluginName + '/src/Resources/config/services.xml'));
        
        this.fs.copyTpl(this.templatePath('src/Resources/snippet/de_DE/storefront.de-DE.json'), this.destinationPath(pluginName + '/src/Resources/snippet/de_DE/storefront.de-DE.json'),
        { 
            shortname: name.toLowerCase(),
        });

        this.fs.copyTpl(this.templatePath('src/Resources/snippet/en_GB/storefront.en-GB.json'), this.destinationPath(pluginName + '/src/Resources/snippet/en_GB/storefront.en-GB.json'),
        { 
            shortname: name.toLowerCase(),
        });
    }
};