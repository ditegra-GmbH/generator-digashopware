#
# Makefile
#

.PHONY: help
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# ------------------------------------------------------------------------------------------------------------

prod: ## Installs all production dependencies
	composer install --no-dev

dev: ## Installs all dev dependencies
	composer install

test: ## Starts all Tests
	php ./vendor/bin/phpunit --configuration=./phpunit.xml

stan: ## Starts the PHPStan Analyser
	php ./vendor/bin/phpstan --memory-limit=1G analyse .

clean: ## Cleans all dependencies
	rm -rf vendor/*
	rm -rf ./src/Resources/app/administration/node_modules/*
	rm -rf ./src/Resources/app/storefront/node_modules/*

build: ## Installs the plugin, and builds the artifacts using the Shopware build commands (requires Shopware)
	cd /var/www/html && php bin/console plugin:refresh
	cd /var/www/html && php bin/console plugin:install <%= name %> --activate | true
	cd /var/www/html && php bin/console plugin:refresh
	cd /var/www/html && ./bin/build-js.sh
	cd /var/www/html && php bin/console theme:refresh
	cd /var/www/html && php bin/console theme:compile

zip:
	$(eval VERS := $(shell cat composer.json | jq '.version'))
	@echo Create zip for version: $(VERS)
	cd .. && rm -rf ./.build/<%= name %>* && mkdir -p ./.build
	cd .. && zip -qq -r -0 ./.build/<%= name %>_$(VERS).zip <%= name %>/ -x '*.editorconfig' '*.git*' '*.reports*' '*/.idea*' '*/tests*' '*/node_modules*' '*/makefile' '*.DS_Store' '*/switch-composer.php' '*/phpunit.xml' '*/.infection.json' '*/phpunit.autoload.php' '*/.phpstan*' '*/.php_cs.php' '*/phpinsights.php'

release: ## Builds a production version and creates a ZIP file in plugins/.build
	@make clean
	@make build
	@make zip