[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ddf970eec3da4b668f90bb03d012872e)](https://www.codacy.com/gh/EnviDat/envidat_frontend?utm_source=github.com&utm_medium=referral&utm_content=EnviDat/envidat_frontend&utm_campaign=Badge_Grade)
[![DeepScan grade](https://deepscan.io/api/teams/6114/projects/7972/branches/89555/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6114&pid=7972&bid=89555)
![Travis (.com) branch](https://img.shields.io/travis/com/EnviDat/envidat_frontend/develop)

# EnviDat Frontend

Frontend for the Envidat platform which provides environmental research data from researchers of the Swiss Federal Institute for Forest, Snow and Landscape.
The backend API is based on CKAN so the respective actions are used to consume the metadata about the research data.

The frontend replaces some of the Features of the ckan ui, but as of version 0.x.x doesn't provide all the features of the ckan ui yet.

# Installation

After cloning the project, use <code>npm install</code> to install all the dependencies.

Local development: <code>npm run serve</code>
Create a build: <code>npm run build</code> or <code>npm run build --modern</code>
Local Storybook: <code>npm run storybook</code>

# Usage

You **have to change the environment variables** in the .env.development / .env.production files

An example of the .env.development:
<code>
  VUE_APP_USE_TESTDATA=true
  VUE_APP_CONFIG_URL=./testdata/config.json
  VUE_APP_ENVIDAT_PROXY=<https://www.envidat.ch>
</code>

When <code>VUE_APP_USE_TESTDATA=true</code> VUE_APP_ENVIDAT_PROXY variable is ignored and the
local testfiles are being used. So you have to have json files in the /public/testdata/ folder which 
resemble the result of the ckan actions. Like the action 'current_package_list_with_resources'
for all the datasets or 'package_show' for a single dataset.

For more details about the actions check '\*actions.js' files in the respective modules.
E.g. './src/modules/meatadata/store/metadataAction.js' for metadata / dataset actions
'./src/modules/projects/store/projectsAction.js' for projects actions.

For a **productive build** you have to change the VUE_APP_ENVIDAT_PROXY variable to point to your CKAN backend.
If the VUE_APP_USE_TESTDATA is still on true, the testdata is being used regardless of being
a production build.

An example of the .env.production:
<code>
  VUE_APP_USE_TESTDATA=false
  VUE_APP_CONFIG_URL=./config.json
  VUE_APP_ENVIDAT_PROXY=<https://www.envidat.ch>
</code>

Would you use any other backend you would need to adjust the code in the store actions files
to handle the response and it's content accordingly.

Check the CKAN actions and their details here: <https://docs.ckan.org/en/2.8/api/index.html>

# Config

The config.json can be used to inject configurations from the server side into the frontend without rebuilding the project.

Minimal config.json setup on server side is:
<code>
{ "version": "0.6.93" }
</code>

The version is used to check if the user has to reload the frontend, in case a newer version is available.

## Configuration Options (version 0.6.921)

Option    | Usage  | Type  | Required | Default
--------- | --------- | --------- | --------- | --------- 
aboutInfo | Is a list of json objects which are represented in the about info cards. At least provide strings for card "title" and card "text". Title should be kept short. Text can include html / markdown. Overwrite the "img" via an url to provide a different image. Reference [About Page](https://www.envidat.ch/#/about/about). | Array | false    | Default infos are hard coded in the about page and are only used if nothing is provide from the backend. Once something is provide via server side config, only the about card infos from the backend config are used. Default cards are 'Contact', 'Our Mission', 'Concept', 'Community', 'WSL' and 'Team'.
metadataConfig.loadLocalFile | Set true to make usage of the metadataConfig.localFileUrl | Boolean | false | false 
metadataConfig.localFileUrl | The url which is used to load all the metadata for "static usage" or fallback together with the maintenance mode. | String | false | false
metadataConfig.publicationsConfig | Contains the details for the Related Publication section in the metadata page. | Object | false | false 
publicationsConfig.resolveIds | Set true to make usage of the publicationsConfig.resolveBaseUrl | Boolean | false | false 
publicationsConfig.idPrefix | Prefix which is used the check for an id in the related publications text. | String | true | * 
publicationsConfig.idDelimiter | Prefix which is used the check for an id in the related publications text. | String | true | : 
publicationsConfig.resolveBaseUrl | Set true to make usage of the publicationsConfig.resolveBaseUrl | String | false | false 
metadataConfig.authorDetailsConfig | Contains the details for the author details in the metadata page. | Object | false | false 
authorDetailsConfig.showAuthorInfos | Enable to make the author infos show up (includes, email, ORCID, Affiliation) | Boolean | false | false 
authorDetailsConfig.showDataCredits | Enable to make the data credit list show up | Boolean | false | true 
authorDetailsConfig.showDataCreditScore | Enable to make the data credit score and level show up | Boolean | false | false 
metadataConfig.resourcesConfig | Contains the details for the author details in the metadata page. | Object | false | false 
resourcesConfig.downloadActive | Contains the details for the author details in the metadata page. | Object | false | false 
projectsConfig.loadLocalFile | Set true to make usage of the projectsConfig.localFileUrl | Boolean | false | false 
projectsConfig.localFileUrl | The url which is used to load all the projects data for "static usage" or fallback together with the maintenance mode. | String | false | false 
maintenanceConfig | Contains the details for the maintenance / message. | Object | false | false 
maintenanceConfig.signinDisabled | Disable sign in links to prevent the user from using any signed in functionalities. | Boolean | false | false 
maintenanceConfig.messageActive | Enables the message banner for the maintenance mode message. | Boolean | false | false 
maintenanceConfig.message | The actual message shown on the banner. | String | "" | false 
effectsConfig | Contains the details for the shown effects. | Object | false | false 
effectsConfig.landingPageParticles | Enables polygon particles showing on the lower part of the landing page for an "dynamic forest analysis" effect. | Boolean | false | true
effectsConfig.decemberParticles | Enables showing snow particles falling down in the background of all pages during december. | Boolean | false | true 

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


# Missing Features

-   Organization list
-   Any sign in / logged in functionalities like uploading and editing any data, these are coming with the release of version 0.7.x.
-   Advanced Search filters

# Known issues

-   When using the text search on the BrowsePage (route /#/browse), the 'query' action which is being called, isn't a standard ckan action it's custom built. That has to be replace manually to the 'package_search' action from ckan, with the respective parameters for a solr query and the repsonse maybe have to be handled differently.
-   Some links are still hard coded, e.g. when linking in the navigation on the organizations the link is still hard coded to www.envidat.ch
