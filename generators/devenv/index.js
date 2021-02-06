var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    async prompting() {
        this.answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your development environment name"
            },
            {
                type: "input",
                name: "dockwareversion",
                message: "Please provide your dockware version like 6.3.5.0 (default)"
            }
        ]);
    }

    writing() {

        let name = this.answers.name;
        let version = this.answers.dockwareversion;
        if(!version){
            version = '6.3.5.0';
        }

        this.fs.copyTpl(
            this.templatePath('loregi.code-workspace'),
            this.destinationPath(name + '/' + name + '.code-workspace'));
        
        this.fs.copyTpl(
            this.templatePath('docker-compose.yml'),
            this.destinationPath(name + '/docker-compose.yml'),
            { 
                containername: name,
                version: version
            }
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