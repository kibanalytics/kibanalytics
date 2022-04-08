MAKEFLAGS += --silent
#SHELL = /bin/bash -o pipefail

include .env

help:
	sed -rn 's/^([a-zA-Z0-9_-]+):.*?##(.*).*?## (.*)/'$$(tput setaf 99)'make '$$(tput setaf 99)$$(tput bold)'\1|'$$(tput setaf 96)'\2'$$(tput sgr0)'|\3/p' < $(or ${makefile}, Makefile) | sort | column -t -s "|"

logstash-config: ## ## Generates a logastash config
	export $$(cat ./.env | xargs) && bash ./bin/generate_logstash_pipeline.sh | tee ./elk/logstash/pipeline/tracker.conf

elk-start: logstash-config ## ## Alias for docker-compose up -d elasticsearch logstash kibana
	docker-compose up -d elasticsearch logstash kibana


update: ## ## Shortcut to update repository and restart app
	docker-compose ps
	git pull && npm i && docker-compose up -d node && docker-compose restart node
	docker-compose ps
