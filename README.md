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

## Development Setup

Before going further, make sure that ```docker``` and ```docker compose``` are installed on your system.

```bash
# 1. clone the repository
  git clone --recursive git@github.com:Ferlab-Ste-Justine/clin-prescription-ui.git

# 2. enter the project's folder
  cd clin-prescription-ui

# 3. create an .env file (you may have to adjust the template to your needs)
  cp -p env-qa .env
  # Or user the make target:
  make local_env
```
### With docker
```sh
# 1. To start the containers
  make start

# 2. To clean up afterwards once your are done developing.
  make stop

# 3. To start cypress container
  make start_cypress

```
:warning: _With this setup, your host and the app's container share the project directory/volume._

## clin-portal-theme
Common styles for the project are defined in ```clin-portal-theme``` dependency.
To update those styles, juste update the dependency version.

### local dev
#### direct link
To use your local ```clin-portal-theme``` in place of the one in dependencies you can use the make target:
```bash
make theme_local
```
The project will use your local ```clin-portal-theme``` so watch script will react to any changes (once you build the ```clin-portal-theme```)

To eject the local ```clin-portal-theme``` use the make target:
```bash
make theme_external
```

#### using temporary tags
You can also simply use custom tag in your local ```clin-portal-theme``` (for exemple you can use a tag matching the Jira story: @clin-xxxx).
You'll need to update the tag after any changes in the project (you can use the make target **retag** of theme: ```t=@clin-xxxx make retag```).
Once ```clin-portal-theme``` is re-tagged, you can simply use the make target:
 ```bash
make theme_clean_install
```
This will update your dependency with last tag.