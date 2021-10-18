var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    async prompting() {
        
        this.answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your development environment name",
                store: true
            },
            {
                type: "input",
                name: "dockwareversion",
                message: "Please provide your dockware version like 6.4.0.0 (default)",
                store: true
            },
        ]);
    }

    writing() {

        let name = this.answers.name;
        let version = this.answers.dockwareversion;
        if(!version){
            version = '6.4.0.0';
        }
        
        this.fs.copyTpl(
            this.templatePath('diga.code-workspace'),
            this.destinationPath(name + '/' + name + '.code-workspace'));

        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath(name + '/README.md'));
        
        this.fs.copyTpl(
            this.templatePath('docker-compose.yml'),
            this.destinationPath(name + '/docker-compose.yml'),
            { 
                containername: name,
                version: version
            }
        );

        // Copy gulpfile & package.json the app zip creation helper tasks
        this.fs.copyTpl(
            this.templatePath('src/custom/gulpfile.js'), 
            this.destinationPath(name + '/src/custom/gulpfile.js')
        );

        this.fs.copyTpl(
            this.templatePath('src/custom/package.json'), 
            this.destinationPath(name + '/src/custom/package.json')
        );

        this.fs.copyTpl(
            this.templatePath('src/.vscode/launch.json'),
            this.destinationPath(name + '/src/.vscode/launch.json')
        );

        this.fs.copyTpl(
            this.templatePath('src/.vscode/sftp.json'),
            this.destinationPath(name + '/src/.vscode/sftp.json')
        );

        this.fs.copyTpl(
            this.templatePath('src/config/packages/twig.yaml'),
            this.destinationPath(name + '/src/config/packages/twig.yaml')
        );
    }
};