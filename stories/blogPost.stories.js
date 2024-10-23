/**
 * @summary story of MetadataCard & MetadataCardPlaceholder for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-11-04 11:39:07
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BlogPost from '@/modules/blog/components/BlogPost.vue';

const postContent = `11.12.2023

# Why Do I Need a DOI?

### Do you want your paper to be published in a peer-reviewed journal? Would you like the number of citations of your paper to increase?

*Text: Rebecca Kurup Buchholz*

If you answered yes to either of the questions above, then you need a DOI for your data!
A DOI is a persistent digital object identifier that is used to uniquely identify any object (physical, digital, or abstract). In the scientific community DOIs are commonly assigned to journal articles and their associated datasets. Every new dataset uploaded to EnviDat is automatically assigned a DOI. If the related journal article is included in the dataset’s metadata, then the research data from EnviDat is automatically linked with the corresponding publication registered in DORA.

DOIs are comprised of a prefix that references an organization and a suffix. The URL of the server used to direct users to the DOI is also often included.

![DOI Anatomy](https://s3-zh.os.switch.ch/frontend-static/blog/images/doi_prefix.jpg "DOI Anatomy")

In recent times numerous journals have implemented policies that require authors to share their data in a professional repository. For example, a condition of publication in many journals today is that authors are required to make materials, data, code, and associated protocols promptly available to readers without undue qualifications [1].
Uploading your dataset to EnviDat is a quick way to obtain a DOI that will fulfill the data sharing requirement of scientific journals.

Another advantage of using EnviDat to publish your data, and correctly citing and linking the research data from EnviDat with the associated paper, is that your paper may receive more citations. Papers that provided a link to data gained 25% more citations on average than those that did not, according to a 2020 study of more than 50,000 articles in the PLOS and BMC journals [2].

As always, if you have questions, please get in touch with the EnviDat team at envidat@wsl.ch. We are here to support your inquiries related to DOIs, Research Data Management (RDM), Data Management Plan (DMP) and more general Open Science topics.

[1] Nature Portfolio. [www.nature.com/nature-portfolio/editorial-policies/reporting-standards] (https://www.nature.com/nature-portfolio/editorial-policies/reporting-standards).
Accessed 7 November 2023.
[2] Science. [www.science.org/content/article/ready-set-share-researchers-brace-new-data-sharing-rules](https://www.science.org/content/article/ready-set-share-researchers-brace-new-data-sharing-rules)
Accessed 8 November 2023.
`;

export default {
  title: '15 Blog Page / Blog Elements',
  component: BlogPost,
};

export const PostContent = {
  args: {
    // post: 'markdown.md',
    postContent,
  },
};
