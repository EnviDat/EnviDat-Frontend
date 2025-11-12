import { it, describe, expect } from 'vitest';

import { getResearchUnitDatasets, renderMarkdown, stripMarkdown } from '@/factories/stringFactory';

// import metadatas from '@/../public/testdata/full_packagelist.json';
import researchUnits from '@/../public/researchUnits.json';
import { formatBytes, parseBytes } from '@/factories/resourceHelpers.js';

const datasets = null; // metadatas.result;

const markdownString = `It's been a while since the last EnviDat release, we had a bit a different focus for a while.
Because we have released an other app: the S3 Browser which provides access to large datasets on [EnviCloud](https://envicloud.wsl.ch/)
(It's also an open source project available: https://github.com/EnviDat/S3_Browsing)

### Major Features
**Read-Only Mode**
EnviDat can now run on in a read-only mode, which allows users to explore the metadata and all the other information about Envidat when the servers are in maintenance for example. An info banner is shown to indicate that any connection to the server is currently not possible.

**Tidied up the Navigation**
The About Page includes now the Policies, Guidelines and DMP Templates that's why the navigation has become smaller.
Directly access to [Guidelines](https://www.envidat.ch/beta/#/about/guidelines) is still possible, also for the [Policies](https://www.envidat.ch/beta/#/about/policies) and for the [Data Management Plan](https://www.envidat.ch/beta/#/about/dmp)
`;

const paragraphTag = '<p';
const hrTag = '<h3';
const aTag = '<a';

describe('Byte parsing', () => {
  it('converts zero correctly', () => {
    expect(parseBytes('0 B')).toBe(0);
  });

  it('handles basic units', () => {
    // expect(parseBytes('1 B')).toBe(1);
    expect(parseBytes('1 KB')).toBe(1024);
    expect(parseBytes('1 MB')).toBe(1024 ** 2);
    expect(parseBytes('1 GB')).toBe(1024 ** 3);
    expect(parseBytes('1 TB')).toBe(1024 ** 4);
  });

  it('handles back and forth formatting units', () => {
    expect(parseBytes(formatBytes(1))).toBe(1);
    expect(parseBytes(formatBytes(1024))).toBe(1024);
    expect(parseBytes(formatBytes(1024 ** 3))).toBe(1024 ** 3);
    expect(parseBytes(formatBytes(1024 ** 4))).toBe(1024 ** 4);
    expect(parseBytes(formatBytes(1024 ** 5))).toBe(1024 ** 5);
    expect(parseBytes(formatBytes(1024 ** 6))).toBe(1024 ** 6);
    expect(parseBytes(formatBytes(1024 ** 7))).toBe(1024 ** 7);
    /*
    expect(parseBytes(formatBytes(56878))).toBe(56878);
    expect(parseBytes(formatBytes(3453456745))).toBe(3453456745);
*/
  });

  /*
  it('parses fractional values and rounds to the nearest byte', () => {
    expect(parseBytes('1.5 KB')).toBe(1536); // 1.5 * 1024
    expect(parseBytes('2.34 MB')).toBe(2457600); // 2.34 * 1024² ≈ 2 457 600
    expect(parseBytes('0.001 GB')).toBe(1073742); // ~1 073 742 bytes
  });
*/

  // -----------------------------------------------------------------
  // 🧩 Tolerance checks (whitespace, case, signs)
  // -----------------------------------------------------------------
  it('ignores surrounding whitespace and is case‑insensitive', () => {
    expect(parseBytes('  42 kb  ')).toBe(42 * 1024);
    expect(parseBytes('\t3.5 Mb')).toBe(3.5 * 1024 ** 2);
  });

  /*
  it('accepts explicit plus/minus signs', () => {
    expect(parseBytes('+10 KB')).toBe(10 * 1024);
    // Negative numbers are technically allowed by the regex;
    // the function will return a negative byte count.
    expect(parseBytes('-5 B')).toBe(-5);
  });

  it('throws on malformed strings', () => {
    const badInputs = [
      '',
      '   ',
      'foo',
      '123',
      '12 XB', // unsupported unit
      '1.2.3 MB', // invalid number
      '10KBextra', // trailing junk
      '10  MB', // double space before unit (still ok, but test strictness)
    ];

    badInputs.forEach((input) => {
      expect(() => parseBytes(input)).toThrowError();
    });
  });
*/

  it('handles very large sizes without overflow', () => {
    // 1 YB = 1024⁸ bytes ≈ 1.2089258196146292e+24
    const yottabytes = parseBytes('1 YB');
    expect(yottabytes).toBeCloseTo(1.2089258196146292e24, 0);
  });
});

describe('stringFactory - renderMarkdown', () => {
  it('renderMarkdown - empty', () => {
    const emptyOutput = renderMarkdown();
    expect(emptyOutput).toBe('');
  });

  it('renderMarkdown - markdown input with url link', () => {
    const markOut = renderMarkdown(markdownString);
    expect(markOut).toBeDefined();
    expect(markOut).not.toBe('');
    expect(markOut.includes(paragraphTag)).toBeTruthy();
    expect(markOut.includes(hrTag)).toBeTruthy();
    expect(markOut.includes(aTag)).toBeTruthy();
  });
});

describe('stringFactory - stripMarkdown', () => {
  it('stripMarkdown - empty', () => {
    const emptyOutput = stripMarkdown();
    expect(emptyOutput).toBe('');
  });

  it('stripMarkdown - markdown input with url link', () => {
    const markOut = stripMarkdown(markdownString);
    expect(markOut).toBeDefined();
    expect(markOut).not.toBe('');
    expect(markOut.includes('**')).toBeFalsy();
    expect(markOut.includes('###')).toBeFalsy();
    expect(markOut.includes('[EnviCloud]')).toBeFalsy();
  });

  it('stripMarkdown - markdown input and strip html', () => {
    const stripHtmlTags = true;
    const markOut = stripMarkdown(markdownString, stripHtmlTags);
    expect(markOut).toBeDefined();
    expect(markOut).not.toBe('');
    expect(markOut.includes(paragraphTag)).toBeFalsy();
    expect(markOut.includes(hrTag)).toBeFalsy();
    expect(markOut.includes(aTag)).toBeFalsy();
  });

  // const imgText = '![alt text](https://www.envidat.ch/dataset/6480bbef-06bf-4da8-8502-96f4def23358/resource/0a9d712c-38ad-4f55-842e-36b21a7e1b97/download/isotopelab_wsl.jpg "Isotope Laboratory WSL") Isotope Laboratory WSL For more information see: https://www.wsl.ch/en/about-wsl/instrumented-field-sites-and-laboratories/laboratories/isotope-laboratory.html';
  const imgText =
    '![alt text](https://www.envidat.ch/dataset/6480bbef-06bf-4da8-8502-96f4def23358/resource/0a9d712c-38ad-4f55-842e-36b21a7e1b97/download/isotopelab_wsl.jpg "Isotope Laboratory WSL")\r\n\r\nThe lab uses stable isotope ratios of the light elements hydrogen, carbon, nitrogen and oxygen as a universal tool for studying physical, chemical and biological processes in forests and other ecosystems. Due to natural isotope fractionations, environmental changes leave unique fingerprints in organic matter, like tree-rings. It is, therefore, possible to detect the influence of ongoing climate changes on plant physiology. By applying isotopically labelled substrate, matter fluxes through plants and soil can be traced and better understood. The facility has isotope-Ratio mass-spectrometers and dedicated periphery for the analysis of organic matter, gas samples and water samples. With HPLC and GC we apply compound-specific isotope ratio analysis of sugars and organic acids. Additional isotope mass-spectrometers are operated by the Zentrallabor WSL.';

  it('stripMarkdown - markdown image url and strip html', () => {
    const stripHtmlTags = true;
    const markOut = stripMarkdown(imgText, stripHtmlTags);
    expect(markOut).toBeDefined();
    expect(markOut).not.toBe('');
    expect(markOut.includes('[alt text]')).toBeFalsy();
    expect(markOut.includes(aTag)).toBeFalsy();
  });

  const malformattedImgText =
    '! [alt text] (https://www.envidat.ch/dataset/6480bbef-06bf-4da8-8502-96f4def23358/resource/0a9d712c-38ad-4f55-842e-36b21a7e1b97/download/isotopelab_wsl.jpg "Isotope Laboratory WSL") Isotope Laboratory WSL For more information see: https://www.wsl.ch/en/about-wsl/instrumented-field-sites-and-laboratories/laboratories/isotope-laboratory.html';

  it('stripMarkdown - malformatted image url and strip html', () => {
    const stripHtmlTags = true;
    const markOut = stripMarkdown(malformattedImgText, stripHtmlTags);
    expect(markOut).toBeDefined();
    expect(markOut).not.toBe('');
    expect(markOut.includes('[alt text]')).toBeTruthy();
    expect(markOut.includes(aTag)).toBeFalsy();
  });
});

describe('stringFactory - getResearchUnitDatasets', () => {
  it('getResearchUnitDatasets - empty', () => {
    const emptyOutput = getResearchUnitDatasets();
    expect(emptyOutput).toBe(null);
  });

  it('getResearchUnitDatasets - with input', () => {
    if (!datasets) {
      // to test it the full_package.json has to be added, which
      // I don't want to have in the git repo! Add it manually
      // it's the content of https://www.envidat.ch/api/action/current_package_list_with_resources?limit=1000
      return;
    }

    const researchUnitMap = getResearchUnitDatasets(researchUnits, datasets);
    expect(researchUnitMap).toBeDefined();

    let ruDatasetsCount = 0;

    for (const [ruName] of researchUnitMap) {
      const ruDatasets = researchUnitMap.get(ruName);
      // console.log(`${ruName} has ${ruDatasets.length}`);
      ruDatasetsCount += ruDatasets.length;
    }

    if (datasets.length !== ruDatasetsCount) {
      console.warn(
        `Tested getResearchUnitDatasets() input datasets: ${datasets.length} total output: ${ruDatasetsCount}`,
      );
    }

    expect(datasets.length === ruDatasetsCount).toBeTruthy();
  });
});
