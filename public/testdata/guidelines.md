# EnviDat Guidelines for Publishing Research Data v. 0.1

<br />

#### Preamble

The EnviDat guidelines for publishing research data are subject to change by EnviDat at any time and without notice. The updated guidelines will be posted on the EnviDat website. For any questions, please contact EnviDat support at [envidat@wsl.ch](mailto:envidat@wsl.ch). 

<br />

## Guidelines for Publishing Data in EnviDat

EnviDat is open to all types of WSL research data and associated resources. The focus is on curated, quality-controlled publication data, i.e., research data accompanying a scientific publication. It is however up to the data Providers (i.e., the data producers or data providers) to decide what they would like to upload to EnviDat and how they would like to make it accessible (open or restricted). Restrictions from the side of EnviDat might be imposed for very large amounts of data.
It is recommended to make research data available in EnviDat at the time of publication of the respective scientific output/publication (e.g., peer-reviewed journal paper or similar). This is now often a requirement of the scientific publishers.
The WSL data policy requires you to register (i.e., document with metadata) your data sets in EnviDat two years after the completion of the project (or a project phase) at the latest. For any questions, please contact EnviDat support at [envidat@wsl.ch](mailto:envidat@wsl.ch).

<br />

## Publishing  Curated, Quality-controlled Datasets

 EnviDat is generally open for all types of WSL research data in a range of data formats. The experts and original data providers decide what to include. If a DMP is available for the project, the DMP provisions should reflect the solutions chosen.

 The data sets must be:

-   Curated
-   Quality-controlled
-   Documented, and thus reusable
-   Publication-ready 

<br />

This should be the normal case for projects having followed a DMP.  
In any case, please note that we **donâ€™t serve** :

-   Data â€œdumpsâ€ (undocumented, non-quality-controlled)
-   Non-curated raw data (except sensor data and raw-data associated with data papers)

<br />

## Responsibilities for Data Providers

<br />

-   You have aquired the permission to publish the dataset from your group, research unit leaders, or your organization.
-   The data belongs to you / your institution, or you have acquired the permission from third-parties to publish it.
-   The content (metadata and data) must not violate copyright, privacy, confidentiality, non-disclosure agreements or institutional research integrity policies.

<br />
<br />

## Getting Editor Rights to Publish Data in EnviDat

<br />

### Login for Data Providers

Data providers gain access with a passwordless login procedure. This ensures that there is no need to store user passwords. Consequently, simply provide your Email address and request a token to be sent to your email account.

### First Time Data Providers

Please check if someone from your research group or unit has already publish data in EnviDat. If so, please ask your colleague to put you in touch with the EnviDat Data Manager for your group in order to gain access. Send an email to [envidat@wsl.ch](mailto:envidat@wsl.ch) in case you donâ€™t know who to contact in your research group or unit.
If you are the first person from your research group or unit publishing research data in EnviDat, after the first login, please request your research group or unit leader to send an email to [envidat@wsl.ch](mailto:envidat@wsl.ch) and request editing rights for you and your research group or unit.
External (non-WSL) data providers are only allowed to publish data in EnviDat, when they have a cooperation with a WSL research unit, research group or with individual employees. Please ask your WSL point of contact to get in touch with the EnviDat team at [envidat@wsl.ch](mailto:envidat@wsl.ch) in order to receive editing rights.

<br />

## Creating & Editing Metadata

<br />

**Disclaimer: you are responsible for the validity, authenticity, quality of the information you provide and for respecting copyrights of the metadata and uploaded files.**

### Title

 Avoid overly long titles. When browsing through metadata in the overview, only about the first 70 characters will be shown.

### Description

In general, the description has to be provided as a short, accurate structured and formatted text.
Use the markdown syntax to format the text (<https://markdown-it.github.io/>) so it's easily readable and readers can extract the necessary information quickly.

Try to keep the description as brief as possible, **but as long as necessary** so anyone reading it can find answers to the following key questions:

-   **What are the research data about**
-   **Which methods were used**
-   **When and where was the data created / extracted**

<br />

If the description becomes too long and detailed, we recommend to upload a readme.txt or readme.pdf which describes all the methods in detail. Or if there are, for example, different methods were used to create data in different files, it might make sense to describe the variety of methods in more detail in the description of the corresponding resource.

### Keywords

Keywords are an **important way to filter** through metadata and browse for topic-specific research data.
Reuse any applicable keywords suggested by the dropdown list before creating new ones. Check for common keywords used in your organization or scientific community.
Please provide between 5 to 10 keywords; avoid combinations of multiple words into a single keyword as much as possible.

### Content License

 You have to actively choose a license for your data:

-   The WSL Data Policy asks data users to **attribute and precludes data redistribution unless otherwise agreed with data originators**: 
    _Users may not share WSL research data or place them in data repositories that are accessible to third parties without the prior consent of the WSL data producers. Exclusive rights to reuse or publish WSL research data may not be transferred to commercial publishers or their agents. WSL reserves the right to use its research data itself or make it accessible to third parties for reuse._
-   The Open Database License (ODC-ODbL) asks data users to **attribute**, **share-alike** and **keep open**; (see <https://opendatacommons.org/licenses/odbl/>) for details.
-   "Other" license. In this case, please define in the description all rights, permissions and restrictions that you would like the users of the research data to adhere to.

    The license defines the terms of use for the data. Irrespective of the chosen license, content items may also be **restricted** (see _Research Data Upload_ below) and data users will need to contact you in order to receive access.

<br />

## Research Data Upload

 You can upload files in the resources tab. **The maximum size of one file is 10GB.** If you need to add larger files or a large number of files, please contact us via [envidat@wsl.ch](mailto:envidat@wsl.ch).
 Any file you upload can be **restricted**, requiring people by default **to ask for your permission** before they can download the resource.
 You have the opportunity to provide the source code which was used to process the research data along with the data files. Source code is best prepared using a **Jupyter Notebook**.
(If you need more information about Jupyter Notebooks or how to test-run them on WSL's Linux Cluster Hyperion, contact us via [envidat@wsl.ch](mailto:envidat@wsl.ch) for more information.)
 Finally, it is possible to add a more detailed description to each file; use markdown for formatting the description.

<br />

## Data Publication

 You have two options to publish your research data:

-   **without** a Digital Object Identifier:
    -   you will receive an EnviDat-internal permanent identifier and a link to your dataset
    -   In this case, you can fully edit your dataset at anytime in the future, but the link to your dataset might change over time.
    -   It is your responsibility to update this link, wherever you are using it. Consequently, do not use such a link in any publication, unless you can update the link to your dataset regularly.

<br />

-   **with** a Digital Object Identifier **recommended option for any publication**
    -   In this case, you are accepting the responsibility **not to ever delete the dataset nor to change the already uploaded data files**, as well as any metadata field that influences the citation, especially the Title, URL and Authors.
    -   If errors will need to be corrected in the already uploaded data files, then **upload a new version of the file, but you are not allowed to ever delete already uploaded files**.
    -   You can safely use a DOI to reference the dataset in any publication.
    -   Other metadata can still be edited at anytime, such as improving the Description of the dataset or adding recently papers to the list of Related Publications.
    -   Additional data files can also be added.

<br />
<br /> 
    
For any questions, please contact EnviDat support at mailto:envidat@wsl.ch.

<br /> 
<br /> 
