[![Codacy Badge](https://app.codacy.com/project/badge/Grade/01f1c3e5efb84ce2a39a515682d6e136)](https://www.codacy.com/gh/EnviDat/EnviDat-Frontend/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=EnviDat/EnviDat-Frontend&amp;utm_campaign=Badge_Grade)
[![DeepScan grade](https://deepscan.io/api/teams/6114/projects/7972/branches/89555/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6114&pid=7972&bid=89555)
![Travis (.com) branch](https://img.shields.io/travis/com/EnviDat/envidat_frontend/develop)

# EnviDat Frontend

This is the source code for the frontend of the EnviDat (Environmental Data Repository) platform which provides environmental research data for researchers around the globe. The publication of research data is mainly provided to researchers of the [Swiss Federal Institute for Forest, Snow and Landscape](https://www.wsl.ch).
However, collaborations with external researchers are possible and encouraged.

The frontend connects to the backend API to load research datasets, projects and organizations via CKAN based actions ([CKAN version 2.9](https://docs.ckan.org/en/2.9/api/index.html)).

This main goal of this custom frontend is to improve the UI / UX for the regular usage of researchers looking for environmental research data
and managing their data publications. 

Since version 0.6.x includes features for dataset management, by version 0.8.x mainly creating and editing dataset.
It doesn't replace all the features of the ckan UI.
**For admins and system admins the CKAN UI is still necessary.**

The frontend is build with vue, vuex, vuetify, vite.

# Installation

After cloning the project, use <code>npm install</code> to install all the dependencies.

Local development: <code>npm run serve</code>

Create a build: <code>npm run build</code> or <code>npm run build --modern</code>

Local Storybook: <code>npm run storybook-dev</code>

# Usage

You **have to change the environment variables** in the .env.development / .env.production files.
The .env.production is used when creating a build via <code>npm run build</code>.


### .env.development (release 0.8.0):
```
# enabled using local testdata, files from public/testdata/
VITE_USE_TESTDATA=false

# enable listing of error on the /#/report page
VITE_ERROR_REPORTING_ENABLED=true

# url to load the config from
VITE_CONFIG_URL=./testdata/config.json

# static root is used to load markdown & images for blog, services page
VITE_STATIC_ROOT=https://frontend-static.s3-zh.os.switch.ch

# api root is used to connect to the server backend
# adjust for different testing environments
# VITE_API_ROOT=http://localhost:8991
VITE_API_ROOT=https://envidat04.wsl.ch

# root & base & individual action to make get & post requests to backend
VITE_API_BASE_URL=/api/action/
```

When <code>VITE_USE_TESTDATA=true</code> VITE_API_ROOT variable is ignored and the
local testfiles are being used. There has to be json files in the /public/testdata/ folder which
resemble the result of the actions. Like the action 'current_package_list_with_resources'
for all the datasets or 'package_show' for a single dataset.

For more details about the actions check '\*actions.js' files in the respective modules.
E.g. './src/modules/meatadata/store/metadataAction.js' for metadata / dataset actions
'./src/modules/projects/store/projectsAction.js' for projects actions.


### .env.production (release 0.8.0):

For a **productive build** you have to change the VITE_API_ROOT variable to point to your CKAN backend.
If the VITE_USE_TESTDATA is still on true, the testdata is being used regardless of being
a production build.

```
  VITE_USE_TESTDATA=false
  VITE_CONFIG_URL=./config.json
  VITE_API_ROOT=https://www.envidat.ch
```

To use any other backend,
you would need to adjust the code in the actions of the different vuex stores to connect to different endpoints
and to handle their responses accordingly.

Check the CKAN actions and their details here: <https://docs.ckan.org/en/2.9/api/index.html>

## Proxying CKAN

- Due to CORS and sameSite cookies, the CKAN instance must be accessed from the same domain as the frontend.
- This can be achieved by running both the frontend and CKAN on localhost (see https://gitlabext.wsl.ch/EnviDat/ckan-container.git).
- Alternatively, if the CKAN instance is running on a remote server, the traffic can be proxied to be accessible from localhost.

- Create the file `.ckan-proxy.secret`:
```dotenv
CKAN_HOST=<DOMAIN_OR_IP>:<PORT>
```

- Run the proxy:
```bash
docker compose -f docker-compose.proxy.yml up -d
```

- Access CKAN at localhost:8989 or include in .env.development.
- ```
  VITE_API_ROOT=http://localhost:8989
  ```

# Config

The config.json can be used to inject configurations and change some behavior of frontend components without rebuilding and deploying it.

That can be a simple as changing the welcome text in the dashboard, to completely disconnect the frontend
from the backend and load the datasets (metadata only) from a static file as backup. Helpful when doing maintenance or hotfixes on the server-side.
In that sense, the config provides some basic feature flags for some frontend components.


Minimal config.json setup on server side is:
<code>
{ "version": "0.8.0" }
</code>

The version is used to check if the user has to reload the frontend to get the latest version available.

## Configuration Options (version 0.8.0)

| Option                                   | Usage                                                                                                                                                                                                                                                                                                                        | Type    | Required | Default                                                                                                                                                                                                                                                                                                      |
|------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| version                                  | Prompts the user to reload the page when a newer build is available. Make sure to increase along your with the version in the package.json this is extracted into a build and compared with the version of the config.                                                                                                       | String  | true     | -                                                                                                                                                                                                                                                                                                            |
| welcomeInfo                              | Object with different titles and texts for the Homepage / Landingpage.                                                                                                                                                                                                                                                       | Object  | false    | Defaults are hard coded in the landing page and are only used if nothing is provide from the backend.                                                                                                                                                                                                        |
| aboutInfo                                | Is a list of json objects which are represented in the about info cards. At least provide strings for card "title" and card "text". Title should be kept short. Text can include html / markdown. Overwrite the "img" via an url to provide a different image. Reference [About Page](https://www.envidat.ch/#/about/about). | Array   | false    | Default infos are hard coded in the about page and are only used if nothing is provide from the backend. Once something is provide via server side config, only the about card infos from the backend config are used. Default cards are 'Contact', 'Our Mission', 'Concept', 'Community', 'WSL' and 'Team'. |
| metadataConfig                           | Contains the major configs for MetadataDetailPage component and any fallback urls.                                                                                                                                                                                                                                           | Object  | false    | false                                                                                                                                                                                                                                                                                                        |
| .loadLocalFile                           | Set true to make usage of the metadataConfig.localFileUrl                                                                                                                                                                                                                                                                    | Boolean | false    | false                                                                                                                                                                                                                                                                                                        |
| .localFileUrl                            | The url which is used to load all the metadata for "static usage" or fallback together with the maintenance mode.                                                                                                                                                                                                            | String  | false    | false                                                                                                                                                                                                                                                                                                        |
| .resourcesConfig.downloadActive          | Set true to enable downloading of resources                                                                                                                                                                                                                                                                                  | Boolean | false    | true                                                                                                                                                                                                                                                                                                         |
| .authorDetailsConfig.showAuthorInfos     | Enable to make the author infos show up (includes, email, ORCID, Affiliation)                                                                                                                                                                                                                                                | Boolean | false    | false                                                                                                                                                                                                                                                                                                        |
| .authorDetailsConfig.showDataCredits     | Enable to make the data credit list show up                                                                                                                                                                                                                                                                                  | Boolean | false    | true                                                                                                                                                                                                                                                                                                         |
| .authorDetailsConfig.showDataCreditScore | Enable to make the data credit score and level show up                                                                                                                                                                                                                                                                       | Boolean | false    | false                                                                                                                                                                                                                                                                                                        |
| projectsConfig.loadLocalFile             | Set true to make usage of the projectsConfig.localFileUrl                                                                                                                                                                                                                                                                    | Boolean | false    | false                                                                                                                                                                                                                                                                                                        |
| projectsConfig.localFileUrl              | The url which is used to load all the projects data for "static usage" or fallback together with the maintenance mode.                                                                                                                                                                                                       | String  | false    | false                                                                                                                                                                                                                                                                                                        |
| maintenanceConfig                        | Contains the details for the maintenance / message.                                                                                                                                                                                                                                                                          | Object  | false    | false                                                                                                                                                                                                                                                                                                        |
| .signinDisabled                          | Disable sign in links to prevent the user from using any signed in functionalities.                                                                                                                                                                                                                                          | Boolean | false    | false                                                                                                                                                                                                                                                                                                        |
| .messageActive                           | Enables the message banner for the maintenance mode message.                                                                                                                                                                                                                                                                 | Boolean | false    | false                                                                                                                                                                                                                                                                                                        |
| .message                                 | The actual message shown on the banner.                                                                                                                                                                                                                                                                                      | String  | ""       | false                                                                                                                                                                                                                                                                                                        |
| newsConfig.newsActive                    | If set to true the LandingPage will show the "news" entries in the list.                                                                                                                                                                                                                                                     | Boolean | false    | false                                                                                                                                                                                                                                                                                                        |
| newsConfig.entries                       | A list of news entries (object with title, text and an image url).                                                                                                                                                                                                                                                           | Array   | false    | []                                                                                                                                                                                                                                                                                                           |
| effectsConfig                            | Contains the details for the shown effects.                                                                                                                                                                                                                                                                                  | Object  | false    | false                                                                                                                                                                                                                                                                                                        |
| .landingPageParticles                    | Enables polygon particles showing on the lower part of the landing page for an "dynamic forest analysis" effect.                                                                                                                                                                                                             | Boolean | false    | true                                                                                                                                                                                                                                                                                                         |
| .decemberParticles                       | Enables showing snow particles falling down in the background of all pages during december.                                                                                                                                                                                                                                  | Boolean | false    | true                                                                                                                                                                                                                                                                                                         |
| userEditMetadataConfig                   | Configurations of the Editing / Creation workflow                                                                                                                                                                                                                                                                            | Object  | false    |                                                                                                                                                                                                                                                                                                              |
| .publicationYearsList                    | Amount of years in the selection for the publication year                                                                                                                                                                                                                                                                    | Number  | false    | 30                                                                                                                                                                                                                                                                                                           |
| .publicationMaxFunders                   | Max amount of possible funder entries                                                                                                                                                                                                                                                                                        | Number  | false    | 55                                                                                                                                                                                                                                                                                                           |
| .datasetCreationActive                   | Enables the creation workflow (dataset creation in the local storage), if false users will be redirected to the CKAN UI for dataset creation                                                                                                                                                                                 | Boolean | false    | true                                                                                                                                                                                                                                                                                                         |
| .resourceEditingActive                   | Enables the editing of resources in the editing workflow                                                                                                                                                                                                                                                                     | Boolean | false    | true                                                                                                                                                                                                                                                                                                         |
| .editingRestrictingActive                | Enables dataset owners restrict access to a resource to users which aren't in the same organization and to give access for specific users                                                                                                                                                                                    | Boolean | false    | true                                                                                                                                                                                                                                                                                                         |
| .customFieldsMax                         | Max amount of possible custom fields                                                                                                                                                                                                                                                                                         | Number  | false    | 10                                                                                                                                                                                                                                                                                                           |
| .keywordsListWordMax                     | Max amount words a keyword can consist of (this is avoid long multiple word keywords which filter to narrow immediately)                                                                                                                                                                                                     | Number  | false    | 2                                                                                                                                                                                                                                                                                                            |
| .keywordsCountMin                        | Minimum of keywords necessary for a dataset                                                                                                                                                                                                                                                                                  | Number  | false    | 5                                                                                                                                                                                                                                                                                                            |
| userDashboardConfig                      | Configurations of user dashboard when a user is signed in                                                                                                                                                                                                                                                                    | Object  | false    |                                                                                                                                                                                                                                                                                                              |
| .dashboardRedirect                       | Enable it to redirect the user to the CKAN UI instead of this one (for maintenance)                                                                                                                                                                                                                                          | Boolean | false    | false                                                                                                                                                                                                                                                                                                        |
| .introText                               | The introText & feedbackText are combined to provide an introduction text at the top of the dashboard                                                                                                                                                                                                                        | String  | false    | Implemented in the introductionCard.vue component                                                                                                                                                                                                                                                            |
| .feedbackText                            | Max amount of possible funder entries                                                                                                                                                                                                                                                                                        | Number  | false    | 55                                                                                                                                                                                                                                                                                                           |
| .userEditingEnabled                      | When enabled the users can change it's infos                                                                                                                                                                                                                                                                                 | Boolean | false    | true                                                                                                                                                                                                                                                                                                         |
| .useTokenSignin                          | When enabled the signin is done via modern JWT token exchange provided by the CKAN backend via the passwordless plugin                                                                                                                                                                                                       | Boolean | false    | true                                                                                                                                                                                                                                                                                                         |
| .organizationRolesText                   | Object with different texts which describe the different roles a user can have. This is important for new users which don't have editor rights, as it provides a short instruction how to get the editor rights.                                                                                                             | Object  | false    | true                                                                                                                                                                                                                                                                                                         |
| .showOldDashboardUrl                     | When enabled the introduction text shows a url to change to the CKAN UI, if users can't find a specific feature prodivded by the EnviDat Frontend                                                                                                                                                                            | Boolean | false    | true                                                                                                                                                                                                                                                                                                         |

## Example Config

```
{
  "version": "0.6.921",
  "aboutInfo": [
    {
      "title": "Contact",
      "text": "Contact the EnviDat team by <a href='mailto:envidat@wsl.ch'>envidat@wsl.ch</a> for support, quesitons or feedback."
    },
    {
      "title": "Concept",
      "text": "EnviDat supports the user-friendly registration, documentation, storage, publication, search and retrieval of data sets from the environmental domain. We provide various services to our users and we follow a set of principles as summarized in our concept image below. Additional detailed information can be found in our <a href='https://www.dora.lib4ri.ch/wsl/islandora/object/wsl:18703' target='_blank' rel='noopener noreferrer' onclick='event.stopPropagation();' >concept paper on DORA</a>."
    },
    {
      "title": "Team",
      "widthClass": "col-12 col-sm-6 col-md-8"
    }
  ],
  "metadataConfig": {
    "publicationsConfig": {
      "resolveIds": true,
      "idPrefix": "*",
      "idDelimiter": ":",
      "resolveBaseUrl": "https://www.envidat.ch/dora/"
    },
    "authorDetailsConfig": {
      "showAuthorInfos": true,
      "showDataCredits": true,
      "showDataCreditScore": false
    },
    "resourcesConfig": {
      "downloadActive": false
    },
    "loadLocalFile": true,
    "localFileUrl": "./testdata/packagelist.json"
  },
  "projectsConfig": {
    "loadLocalFile": true,
    "localFileUrl": "./testdata/projects.json"
  },
  "maintenanceConfig": {
    "signinDisabled": true,
    "messageActive": true,
    "message": "We are currently doing maintenance on the server and EnviDat is now in <strong>read-only mode</strong>. Data download, upload and <strong>user data management functionalities are currently disabled</strong>."
  }
}
```


# Missing Major Features vs CKAN UI

- Organizations-Page which lists all the organizations
- User-Page which shows the details of user
- There are various minor features which are missing

# Known issues

-   When using the text search on the BrowsePage (route /#/browse), the 'query' action which is being called, isn't a standard ckan action it's custom built. That has to be replace manually to the 'package_search' action from ckan, with the respective parameters for a solr query and the repsonse maybe have to be handled differently.
