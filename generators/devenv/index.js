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
                name: "dockwareimage",
                message: "Please provide your dockware image like essentials:latest (default)",
                store: true
            },
            {
                type: "input",
                name: "phpversion",
                message: "Please provide the PHP_VERSION (7.2, 7.4, 8.0 or 8.1) default 8.1",
                store: true
            },
            {
                type: "input",
                name: "nodeversion",
                message: "Please proivide the NODE_VERSION Version (14 or 16 are possible) defult 16",
                store: true
            },
        ]);
    }

    writing() {

        let name = this.answers.name;
        let image = this.answers.dockwareimage;
        if(!image){
            image = 'essentials:latest';
        }

        let phpv = this.answers.phpversion;
        if(!phpv){
            phpv = '8.1';
        }
        let nodev = this.answers.nodeversion;
        if(!nodev){
            nodev = '16';
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
                image: image,
                phpversion: phpv,
                nodeversion: nodev,
            }
        );

        this.fs.copyTpl(
            this.templatePath('src/config/packages/twig.yaml'),
            this.destinationPath(name + '/src/config/packages/twig.yaml')
        );

        this.fs.copyTpl(
            this.templatePath('src/messenger_consume.sh'),
            this.destinationPath(name + '/src/messenger_consume.sh')
        );

        this.fs.copyTpl(
            this.templatePath('src/scheduled_task_run.sh'),
            this.destinationPath(name + '/src/scheduled_task_run.sh')
        );
    }
};