# About
This project is the frontend web application for _clin_ and is designed to be used in specific environments specialized in genomics.  


# Usage

## Variables

This application takes minimally the following variables as input:

- **REACT_APP_KEYCLOAK_CONFIG**: Keycloack configurations needed for auth. 
- **REACT_APP_ARRANGER_API**: Arranger endpoint.
- **REACT_APP_ARRANGER_PROJECT_ID**: Specific Arranger project's version.
- **REACT_APP_FHIR_SERVICE_URL**: Fhir endpoint.
- **REACT_APP_ZEPLIN_URL**: Zepplin notebook endpoint.
- **REACT_APP_FHIR_CONSOLE_URL**: Fhir console endpoint.
- **REACT_APP_WEB_ROOT**: Web root endpoint.
- **SASS_PATH**: SASS Path needed to.


## Development Setup

Before going further, make sure that ```docker``` and ```docker-compose``` are installed on your system.

```bash
# 1. clone the repository
  git clone --recursive git@github.com:Ferlab-Ste-Justine/clin-prescription-ui.git

# 2. enter the project's folder
  cd clin-prescription-ui

# 3. create an .env file (you may have to adjust the template to your needs)
  cp -p env-qa .env

**Note:** If the repository was not clone with submodule, please run

  git submodule update --init

### With docker

# 1. in a terminal, run docker-compose from project's docker-compose file.
  docker-compose up

# 2. to clean up afterwards once your are done developing.
  docker-compose down
```
:warning: _With this setup, your host and the app's container share the project directory/volume._


### Update source

Each time we update the projet, the submodules needs to be sync

> git submodule update --init

### Resolve submodule error or out of sync

  git submodule deinit -f .
  git submodule update --init

