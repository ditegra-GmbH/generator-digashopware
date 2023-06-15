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
            {
                type: "input",
                name: "clone",
                message: "are you going to prepare a new environment or to clone an existing one? (new/clone) default new",
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

        let clone = this.answers.clone;
        if(!clone){
            clone = 'new';
        }   

        if(clone == 'new'){
            this.fs.copyTpl(
                this.templatePath('README-new.md'),
                this.destinationPath(name + '/README.md'),
                {
                    containername: name,
                });
        }

        if(clone == 'clone'){
            
            this.fs.copyTpl(
                this.templatePath('README-clone.md'),
                this.destinationPath(name + '/README.md'),
                {
                    containername: name,
                });

            this.fs.copyTpl(
                this.templatePath('digalocaldevcopy.sh'),
                this.destinationPath(name + '/digalocaldevcopy.sh'));
            
            this.fs.copyTpl(
                this.templatePath('digacloneconfig.yaml'),
                this.destinationPath(name + '/digacloneconfig.yaml'));            
        }
    
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
            this.templatePath('src/config/packages/shopware.yaml'),
            this.destinationPath(name + '/src/config/packages/shopware.yaml')
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