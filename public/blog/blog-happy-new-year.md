# EnviDat Guidelines and Template for Preparing a SNSF Data Management Plan (DMP)

<br />

Disclaimer: The guidelines are intended to assist WSL researchers in preparing DMPs as required by the SNSF, however they have not (yet) been vetted by the SNSF. Suggestions for improvements are appreciated.

## Data collection and documentation

<br />

### DMP Question 1.1: **What data will you collect, observe, generate or re-use?**

This project will collect, observe or generate the following data:  

-   [Type_and_content_of_your_data_no_1]
-   [Type_and_content_of_your_data_no_2]
-   [Type_and_content_of_your_data_no_3]
-   ...
-   [Type_and_content_of_your_data_no_n]

This project will reuse the following existing data

-   [Type_and_content_of_your_reused_data_with_preferably_a_link_to_the_data_source_or_repository_no_1]
-   [Type_and_content_of_your_reused_data_with_preferably_a_link_to_the_data_source_or_repository_no_2]
-   [Type_and_content_of_your_reused_data_with_preferably_a_link_to_the_data_source_or_repository_no_3]
-   ...
-   [Type_and_content_of_your_reused_data_with_preferably_a_link_to_the_data_source_or_repository_no_n]

All the above data will be stored as digital files in the following file formats: [list_file_formats_here_such_as_CSV_NetCDF_etc...].
The volume of the generated data is estimated to be in the range of [size][MB/GB/TB].

### DMP Question 1.2: **How will the data be collected, observed or generated?**

The data will be collected according to research data management best practices and, when available, standard calibration procedures, data recording standards, controlled vocabularies, or standard protocols.
All data will be stored as digital files in the existing WSL IT infrastructure, more precisely in a (Network File System) NFS directory dedicated to the project work. The location of the data will be clearly marked, for example by placing all data in a subdirectory named "DATA".
Files and directory stuctures will be named according to a pre-agreed conventions, that specify for example their versions and if the files are "raw data", "processed data", or "publication-ready data". The entire dataset as well as the directory hierarchy will be properly documented in a README.txt file, which will visibly be placed in the root directory of the dataset.
Furthermore, a partial or full copy of the datasets will be kept on researchers' computers or external storage, for various project purposes such as data analysis and data processing. New generated file versions that are generates researchers' computers, if decided relevant to be preserved, will be appropriately marked as new versions, copied to main NFS project data folder and the README.txt file updated. 
The final, completed, publication-ready dataset will be made available according to FAIR data principles in the Environmental Data Portal and Repository EnviDat (www.envidat.ch). 

### DMP Question 1.3: **What documentation and metadata will you provide with the data?**

The data will accompanied by a description containing sufficient details in order to help secondary data users to understand and reuse the data set. This description will be part of metadata that is required in order to publish the data set in the Environmental Data Portal and Repository EnviDat (www.envidat.ch). 
The metadata is based on the EnviDat flexible metadata schema, including elements such as:

-   Title
-   Organization
-   Description
-   Funding information
-   Related publications
-   Keywords
-   Authors (with their names, ORCIDs, emails, affiliations and their contributor roles according to DataCRediT - <https://www.wsl.ch/datacredit/#feat>)
-   Contact person
-   Date(s) for when the data set was collected or created
-   Content license
-   Version
-   Spatial Extent (as GeoJSON geometry in WGS 84 coordinate reference system)
-   any number of data specific additional metadata fields, as defined by the data producers

<br />

The metadata made available according to the EnviDat metadata schema is compatible with accepted metadata standards such as:

-   DataCite metadata schema (<https://schema.datacite.org/>), a "list of core metadata properties chosen for an accurate and consistent identification of a resource for citation and retrieval purposes", making data sets published in EnviDat globally available in DataCite Search - <https://search.datacite.org/works?query=10.16904+envidat>
-   ISO 19115-1:2014 standard for geographic metadata (<https://www.iso.org/standard/53798.html>), implemented as ISO 19139 for contributing to ESA's Global Earth Observation System of Systems (GEOSS) - <https://www.geoportal.org/community/envidat-community>
-   Directory Interchange Format (DIF) XML schema definition (<https://earthdata.nasa.gov/esdis/eso/standards-and-references/directory-interchange-format-dif-standard>), making EnviDat data sets available in NASA's Earth Observing System Data and Information System (EOSDIS) - <https://gcmd.gsfc.nasa.gov/search/Titles.do?subset=envidat>      

Finally, the software code used to read and/or produce data will be managed, as much as possible, in a code revision management system such as the Git server available at WSL (gitlab.wsl.ch), and if possible and practical, appropriately documented as an interactive Jupyter Notebook. 
The final version of the software will be made available together with publication-ready data set in the Environmental Data Portal and Repository EnviDat (www.envidat.ch).

## Ethics, legal and security issues

<br />

### DMP Question 2.1: **How will ethical issues be addressed and handled?**

The project will respect all requirements of the the Swiss Federal Act on Data Protection and the code of conduct for every researcher is governed by research integrity guidelines.
Where necessary, permissions will be obtained in order to collect, process, preserve and share data in an appropriate manner. Methods to manage ethical concerns may include data anonymization, encryption, signing of formal consent agreements and seeking approval of an ethics committee. 

### DMP Question 2.2: **How will data access and security be managed?**

Sensitive data will be stored in the project directory, in a subdirectory marked appropriately as "sensitive data", that can only be accessed inside the WSL internal network (WSL-Intranet) by personnel cleared by the Principal Investigator (PI) of the project using WSL credentials. The WSL internal network is secured and backed-up according to best practices by WSL IT.
Sensitive data will not be made publicly available in EnviDat (www.envidat.ch) in plain form, but only as an encrypted and restricted resource/file. EnviDat (www.envidat.ch) has the option of restricting access to sensitive resources. 
The EnviDat technical team will provide assistance for the encryption of sensitive data with AES-256 using 7-zip upon request. Encryption keys will be stored in an open source password manager such as KeePass (<https://keepass.info>), running inside a virtual machine hosted by WSL IT dedicated only to the purpose of storing such encryption keys.
Restrictions due to the nature of sensitive data (e.g. legal, ethical, copyright, confiden-tiality  or  other  clauses) will be protected by asking data users to sign a WSL data contract.
In case data shall have to be made available publicly, than such sensitive data will first be anonymized by the data producer, according to the requirements of the the Swiss Federal Act on Data Protection.

### DMP Question 2.3: **How will you handlecopyright and Intellectual Property Rights issues?**

Data is currently not copyrightable in Switzerland and consequently, data (except sensitive data) is suitable for publishing in the EnviDat (www.envidat.ch) repository. Nevertheless, an appropriate license such as WSL data policy, OdBL (opendatacommons.org) or a more permisive license (respecting the FAIR principles for data sharing) will be chosen for the data.
Where appropriate, source code will also be released under an OSI open source license (<https://opensource.org/licenses>) and also linked or published together with the dataset in EnviDat (www.envidat.ch).
Furthermore, if any ownership, copyright or Intellectual Property Rights (IPR) issues may occur, they will be handled according to the institutional recommendation.

## Data storage and preservation

<br />

### DMP Question 3.1: **How will your data be stored and backed-up during the research?**

Data will be stored in the project directory, available as NFS share inside the WSL-Intranet. Project directories are backed-up regularly, securely and professionally, since these activities are the responsibility of the WSL IT. 
Data published in EnviDat is mirrored every night by WSL IT to a second site (in Davos) and similarly backed-up by WSL IT according to their established procedures. Additional informations about the storage and backup procedures for research data (including data uploaded to EnviDat) at WSL, can be provided by WSL IT upon request.

### DMP Question 3.2: **What is your data preservation plan?**

The publication-ready data will be stored, as much as possible, in preservation-friendly, open archival file formats such as Text, PDF-A or CSV. Furthermore, as a general rule, text-based formats are preffered to binary formats for storing data. Where the use of open archival formats are not appropriate, available community standards (e.g. NetCDF) will be considered before the use of proprietary, less-known binary formats. 
The publication-ready data will be stored in EnviDat (www.envidat.ch), ensuring data preservation beyond the life-time of the project. According to EnviDat preservation policy, uploaded data and metadata will be retained for the entire duration of EnviDat existence. In the event of EnviDat having to close down, best efforts will be made to integrate all metadata and content items into a suitable alternative repository.

## Data storage and preservation

<br />

### DMP Question 4.1: **How and where will the data be shared?**

The publication-ready data will be published with Digital Object Identifiers (DOIs) in the Environmental Data Portal and Repository EnviDat (www.envidat.ch).
Potential data users can find out about the data either from:

-   EnviDat: www.envidat.ch 
-   DataCite Search: <https://search.datacite.org/>
-   ESA's Global Earth Observation System of Systems (GEOSS): <https://www.geoportal.org/community/envidat-community>
-   NASA's Earth Observing System Data and Information System (EOSDIS): <https://gcmd.gsfc.nasa.gov/search/Titles.do?subset=envidat> 

EnviDat is a signatory of the COPDESS Statement of Commitment (<https://copdess.org/enabling-fair-data-project/commitment-statement-in-the-earth-space-and-environmental-sciences/signatories/>) and consequently, together with WSL, fully supporting the enabling FAIR Data effort.  

### DMP Question 4.2: **Are there any necessary limitations to protect sensitive data?**

Data will be shared at the time of publication of the respective scientific output. Restrictions due to the nature of sensitive data (e.g. legal, ethical, copyright, confiden-tiality  or  other  clauses) will be protected by asking data users to sign a WSL data contract, which may entail non-disclosure clauses as appropriate.

### DMP Question 4.3: **I will choose digital repositories that are conform to the FAIR Data Principles.**

[CHECK BOX] - check (because EnviDat is a signatory of the COPDESS Statement of Commitment)

### DMP Question 4.4: **I  will  choose  digital  repositories  maintained  by  a non-profit organisation.**

[RADIO BUTTON] - yes (because EnviDat is maintained by WSL)

<br /> 
