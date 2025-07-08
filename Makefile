.ONESHELL:

# Install
env_load:
ifneq ("$(wildcard env-${env}-custom)","")
	cp -p env-${env}-custom .env
	@echo "custom env file loaded!"
else
	cp -p env-${env} .env
	@echo "default env file loaded!"
endif

env_save:
	cp -p .env env-${env}-custom

install:
	make env=localstack env_load
	make js_install

# JS
js_install:
	npm i ${m}

js_clean:
	rm -rf node_modules/${m}

js_clean_install: js_clean js_install

# Only use this target to update the package-lock.json file and dependencies (should be done in a dedicated ticket)
js_hard_clean: js_clean
	rm -f package-lock.json

# Only use this target to update the package-lock.json file and dependencies (should be done in a dedicated ticket)
js_hard_clean_install: js_hard_clean js_install

# Docker
start:
	docker-compose up -d

start_cypress:
	docker compose --profile cypress up -d --build

stop:
	docker compose down

# Work with local ferlab-ui
ferlab_local:
	npm install ../ferlab-ui/packages/ui
	mv tsconfig.paths.json tsconfig.external_ferlab.paths.json
	mv tsconfig.local_ferlab.paths.json tsconfig.paths.json

ferlab_external:
	sed -i '' '/@ferlab\/ui/d' ./package.json
	npm install @ferlab/ui
	mv tsconfig.paths.json tsconfig.local_ferlab.paths.json
	mv tsconfig.external_ferlab.paths.json tsconfig.paths.json

# Work with local clin-portal-theme
theme_local:
	npm install ../clin-portal-theme

theme_external:
	sed -i '' '/clin-portal-theme/d' ./package.json
	npm install github:Ferlab-Ste-Justine/clin-portal-theme

theme_clean_install:
	m=clin-portal-theme make js_clean
	m=clin-portal-theme make js_install

# Tests
ferlease_test:
	CYPRESS_BASE_URL=https://prescription-ui-${jira}.qa.cqgc.hsj.rtss.qc.ca/ ./node_modules/cypress/bin/cypress run --spec "${spec}"

puppeteer_savedraftproban:
	node puppeteer/scenarios/SaveDraftProban.mjs

puppeteer_savedraft_trioprenatal:
	node puppeteer/scenarios/SaveDraftTrioPrenatal.mjs
	
puppeteer_savedraft_triopostnatal:
	node puppeteer/scenarios/SaveDraftTrioPostnatal.mjs
