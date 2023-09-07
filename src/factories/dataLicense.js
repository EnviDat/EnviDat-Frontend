/**
 * @summary the default data license hardcoded
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export const WSL_DATA_LICENSE_ID = 'wsl-data';

export const dataLicenses = [
  {
    id: 'odc-odbl',
    title: 'ODbL with Database Contents License (DbCL)',
    summary: `This is a human-readable summary of the ODbL 1.0 license. Please see the disclaimer below.  

**You are free to:**   
  - *Share*: To copy, distribute and use the database.
  - *Create*: To produce works from the database.
  - *Adapt*: To modify, transform and build upon the database.  

<br /> <br />
**As long as you:**
  - *Attribute*: You must attribute any public use of the database, or works produced from the database, in the manner specified in the ODbL. For any use or redistribution of the database, or works produced from it, you must make clear to others the license of the database and keep intact any notices on the original database.
  - *Share-Alike*: If you publicly use any adapted version of this database, or works produced from an adapted database, you must also offer that adapted database under the ODbL.
  - *Keep open*: If you redistribute the database, or an adapted version of it, then you may use technological measures that restrict the work (such as DRM) as long as you also redistribute a version without such measures.  

<br /> <br />
**Disclaimer**
  This is not a license. It is simply a handy reference for understanding the ODbL 1.0 — it is a human-readable expression of some of its key terms. This document has no legal value, and its contents do not appear in the actual license. Read the full ODbL 1.0 license text (see link below) for the exact terms that apply.
    `,
    link: 'https://opendatacommons.org/licenses/odbl/1-0/',
  },
  {
    id: 'cc-by-sa',
    title: 'Creative Commons Attribution Share-Alike (CC-BY-SA)',
    summary: ` This is a human-readable summary of (and not a substitute for) the license.    

<br /> <br />
**You are free to:**  
- *Share*: copy and redistribute the material in any medium or format
- *Adapt*: remix, transform, and build upon the material for any purpose, even commercially. The licensor cannot revoke these freedoms as long as you follow the license terms.  

<br /> <br />
**Under the following terms:**
 -*Attribution*: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
 -*ShareAlike*: If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
 -*No additional restrictions*: You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.  

<br /> <br />
**Notices:**
You do not have to comply with the license for elements of the material in the public domain or where your use is permitted by an applicable exception or limitation.
No warranties are given. The license may not give you all of the permissions necessary for your intended use. For example, other rights such as publicity, privacy, or moral rights may limit how you use the material.
    `,
    link: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode',
  },
  {
    id: 'CC0-1.0',
    title: 'Creative Commons Zero - No Rights Reserved (CC0 1.0)',
    summary: `This is a human-readable summary of (and not a substitute for) the license.  

<br /> <br />
**No Copyright** 
The person who associated a work with this deed has dedicated the work to the public domain by waiving all of his or her rights to the work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law.
You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission. See Other Information below.  

<br /> <br />
**Other Information**
- In no way are the patent or trademark rights of any person affected by CC0, nor are the rights that other persons may have in the work or in how the work is used, such as publicity or privacy rights.
- Unless expressly stated otherwise, the person who associated a work with this deed makes no warranties about the work, and disclaims liability for all uses of the work, to the fullest extent permitted by applicable law.
- When using or citing the work, you should not imply endorsement by the author or the affirmer.  
    `,
    link: 'https://creativecommons.org/publicdomain/zero/1.0/legalcode',
  },
  {
    id: WSL_DATA_LICENSE_ID,
    title: 'WSL Data Policy',
    summary: `The WSL Data Policy kindly asks data users to attribute and precludes data redistribution unless otherwise agreed with data originators. 

Users may not share WSL research data or place them in data repositories that are accessible to third parties without the prior consent of the WSL data producers. 

Exclusive rights to reuse or publish WSL research data may not be transferred to commercial publishers or their agents. 

WSL reserves the right to use its research data itself or make it accessible to third parties for reuse.
    `,
    link: 'https://www.envidat.ch/#/blog/EnviDat_WSLIntern_2022q4.md',
  },
  {
    id: 'other-undefined',
    title: 'Other (Specified in the description)',
    summary: 'This is an option provide a custom license. It needs to be provided in the description. \n However we do NOT recommend to do it, unless you have a very good reason for it.',
    link: '',
  },
];
