/**
 * function factory for api methods
 *
 * @summary function factory for api methods
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:07:03 
 * Last modified  : 2019-10-30 10:13:56
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

export function urlRewrite(url, baseUrl, proxyUrl, replaceQuestionMark) {
  if (replaceQuestionMark) {
    url = url.replace('?', '&');
  }
  url = url.replace("'", '%22');

  // replace 'NULL' becaues the environment files can't have nothing and only strings
  // as values
  proxyUrl = proxyUrl.replace('NULL', '');

  url = `${proxyUrl}${baseUrl}${url}`;

  return url;
}

export function solrResultToCKANJSON(solorJSON) {
  const ckanStructure = {};

  ckanStructure.id = solorJSON.id;
  ckanStructure.name = solorJSON.name;
  ckanStructure.maintainer = solorJSON.maintainer;

  ckanStructure.metadata_created = solorJSON.metadata_created;
  ckanStructure.metadata_modified = solorJSON.metadata_modified;
  ckanStructure.license_id = solorJSON.license_id;

  let dataDict = null;
  try {
    dataDict = JSON.parse(solorJSON.validated_data_dict);
  } catch (error) {
    // console.log("error validated_data_dict " + error);
  }

  if (dataDict) {
    ckanStructure.owner_org = dataDict.owner_org;
    ckanStructure.relationships_as_object = dataDict.relationships_as_object;
    ckanStructure.private = dataDict.private;
    ckanStructure.publication = dataDict.publication;
    // TODO decode publication?

    // let author = null;
    // try {
    //   author = JSON.parse(dataDict.author);
    // } catch (error) {
    //   // console.log("error validated_data_dict " + error);
    // }
    // ckanStructure.author = author;

    ckanStructure.author = dataDict.author;

    // TODO decode author?
    ckanStructure.author_email = dataDict.author_email;
    ckanStructure.isopen = dataDict.isopen;
    ckanStructure.state = dataDict.state;
    ckanStructure.version = dataDict.version;

    ckanStructure.spatial = dataDict.spatial;
    // TODO decode spatial?
    ckanStructure.spatial_info = dataDict.spatial_info;
    ckanStructure.type = dataDict.type;

    ckanStructure.num_resources = dataDict.num_resources;
    ckanStructure.resources = dataDict.resources;
    // TODO decode resources.restricted
    ckanStructure.num_tags = dataDict.num_tags;
    ckanStructure.tags = dataDict.tags;

    ckanStructure.title = dataDict.title;
    ckanStructure.subtitle = dataDict.subtitle;

    ckanStructure.groups = dataDict.groups;
    ckanStructure.creator_user_id = dataDict.creator_user_id;
    ckanStructure.date = dataDict.date;
    // TODO decode date?

    ckanStructure.resource_type_general = dataDict.resource_type_general;
    ckanStructure.relationships_as_subject = dataDict.relationships_as_subject;

    ckanStructure.doi = dataDict.doi;
    ckanStructure.language = dataDict.language;
    ckanStructure.url = dataDict.url;

    ckanStructure.notes = dataDict.notes;
    ckanStructure.license_title = dataDict.license_title;
    ckanStructure.license_url = dataDict.license_url;
    ckanStructure.organization = dataDict.organization;
    // TODO decode organization?

    ckanStructure.revision_id = dataDict.revision_id;
    ckanStructure.resource_type = dataDict.resource_type;
  }

  return ckanStructure;
}
