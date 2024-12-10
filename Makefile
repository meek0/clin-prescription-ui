.ONESHELL:

# Install
local_env:
	cp -p env-qa .env

install: local_env js_install

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
	docker-compose down

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