var Generator = require('yeoman-generator');
var yosay = require('yosay');
module.exports = class extends Generator {

    async prompting() {

        this.log(yosay('Welcome to ditegras Shopware 6 generator!'));

        this.answers = await this.prompt({
            type: 'list',
            name: 'generator',
            message: 'What do you want to make today?',
                choices: [ 
                    {
                        name: 'Dev Environment (dockware.io based)',
                        value: 'devEnv'
                    },{
                        name: 'App (Plugin) Shopware 6',
                        value: 'sw6app'
                    },{
                        name: 'Theme Shopware 6',
                        value: 'sw6theme'
                    }
                ]
            }
        );
        //based on anwser we need to choose a different 
        // generator and ask for more infos from the customer
        this.generator = this.answers.generator;
        switch (this.answers.generator) {
            case 'devEnv':                
                this.composeWith(require.resolve('../devenv'));
                break;
            case 'sw6app':                
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
                        message: "your app name (without prefix please)"
                    },
                    {
                        type: "input",
                        name: "description",
                        message: "provide a short plugin description"
                    }
                ]);
                break;
            case 'sw6theme':
                this.composeWith(require.resolve('../theme'));
                break;
            default:
                break;
        }
    }

    writing() {
    
        if(this.generator == "sw6app"){
            let name = this.answers.name;
            let pluginName = this.answers.prefix + name;
    
            // Move all the files and replace vars
            this.fs.copyTpl(
                this.templatePath('composer.json'),
                this.destinationPath(pluginName + '/composer.json'),
                { 
                    prefix: this.answers.prefix,
                    company: this.answers.company,
                    shortname: name.toLowerCase(),
                    name: pluginName,
                    description: this.answers.description,
                    manufacturerLink: this.answers.manufacturerLink,
                    supportLink: this.answers.supportLink
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
                prefix: this.answers.prefix.toLowerCase(),
                shortname: name.toLowerCase(),
            });

            this.fs.copyTpl(this.templatePath('src/Resources/snippet/en_GB/storefront.en-GB.json'), this.destinationPath(pluginName + '/src/Resources/snippet/en_GB/storefront.en-GB.json'),
            { 
                prefix: this.answers.prefix.toLowerCase(),
                shortname: name.toLowerCase(),
            });
        }
    }
};