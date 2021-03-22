[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ddf970eec3da4b668f90bb03d012872e)](https://www.codacy.com/gh/EnviDat/envidat_frontend?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=EnviDat/envidat_frontend&amp;utm_campaign=Badge_Grade)
[![DeepScan grade](https://deepscan.io/api/teams/6114/projects/7972/branches/89555/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6114&pid=7972&bid=89555)
![Travis (.com) branch](https://img.shields.io/travis/com/EnviDat/envidat_frontend/develop)

# EnviDat Frontend
Frontend for the Envidat platform which provides environmental research data from researchers of the Swiss Federal Institute for Forest, Snow and Landscape.
The backend API is base on CKAN. So the respective actions are used to consume the metadata about the research data.

# Installtion
<code>npm install</code>

If after the install there are still plugins missing use
<code>npm ci</code>

If it doesn't help they have to be install manually (was once the case for a storybook plugin)


# Usage
If you'd like to use check the CKAN actions https://docs.ckan.org/en/2.8/api/index.html
In general you have to change the environment variables in the .env.development / .env.production files

<code>
  VUE_APP_ENVIDAT_PROXY=https://www.envidat.ch
  VUE_APP_SOLR_PROXY=NULL
</code>

to point to your CKAN backend.
Would you use any other backend you would need to adjust the code in the store actions files
to handle the response and it's content accordingly.

