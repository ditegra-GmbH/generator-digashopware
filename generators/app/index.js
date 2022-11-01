var Generator = require('yeoman-generator');
module.exports = class extends Generator {

    async prompting() {

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
                // this.log(this.contextRoot); 
                this.composeWith(require.resolve('../theme'), {
                   callerPath:  this.contextRoot,
                   destinationRoot: this.contextRoot
                });
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
                this.destinationPath(this.contextRoot + '/' + pluginName + '/composer.json'),
                { 
                    prefix: this.answers.prefix.toLowerCase(),
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
                this.destinationPath(this.contextRoot + '/' +pluginName + '/README.md'),
                { 
                    shortname: name,
                }
            );
            this.fs.copyTpl(this.templatePath('CHANGELOG.md'), this.destinationPath(this.contextRoot + '/' +pluginName + '/CHANGELOG.md'));
            
            this.fs.copyTpl(this.templatePath('.gitignore'), this.destinationPath(this.contextRoot + '/' +pluginName + '/.gitignore'));
            
            this.fs.copyTpl(
                this.templatePath('makefile'),
                this.destinationPath(this.contextRoot + '/' +pluginName + '/makefile'),
                { 
                    name: pluginName,
                }
            );
            
            this.fs.copyTpl(this.templatePath('phpstan.neon'), this.destinationPath(this.contextRoot + '/' +pluginName + '/phpstan.neon'));
            
            //src Folder
            this.fs.copyTpl(
                this.templatePath('src/DigaShopwareGenerator.php'),
                this.destinationPath(this.contextRoot + '/' +pluginName + '/src/' + pluginName + '.php'),
                { 
                    name: pluginName,
                }
            );
            this.fs.copyTpl(this.templatePath('src/Resources/config/config.xml'), this.destinationPath(this.contextRoot + '/' +pluginName + '/src/Resources/config/config.xml'));
            this.fs.copy(this.templatePath('src/Resources/config/plugin.png'), this.destinationPath(this.contextRoot + '/' +pluginName + '/src/Resources/config/plugin.png'));
            this.fs.copyTpl(this.templatePath('src/Resources/config/services.xml'), this.destinationPath(this.contextRoot + '/' +pluginName + '/src/Resources/config/services.xml'));            
            
            this.fs.copyTpl(this.templatePath('src/Resources/snippet/de_DE/storefront.de-DE.json'), this.destinationPath(this.contextRoot + '/' +pluginName + '/src/Resources/snippet/de_DE/storefront.de-DE.json'),
            { 
                prefix: this.answers.prefix.toLowerCase(),
                shortname: name.toLowerCase(),
            });

            this.fs.copyTpl(this.templatePath('src/Resources/snippet/en_GB/storefront.en-GB.json'), this.destinationPath(this.contextRoot + '/' +pluginName + '/src/Resources/snippet/en_GB/storefront.en-GB.json'),
            { 
                prefix: this.answers.prefix.toLowerCase(),
                shortname: name.toLowerCase(),
            });

            //UnitTest sample
            this.fs.copyTpl(
                this.templatePath('tests/Services/SampleTest.php'),
                this.destinationPath(this.contextRoot + '/' +pluginName + '/tests/Services/SampleTest.php'),
                { 
                    name: pluginName,
                }
            );

            this.fs.copyTpl(
                this.templatePath('phpunit.xml'),
                this.destinationPath(this.contextRoot + '/' + pluginName + '/phpunit.xml'),
                { 
                    name: pluginName,
                }
            );
        }
    }
};