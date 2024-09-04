/**
 * @summary story of BaseIconButton & BaseIconCountView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-31 08:14:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import EditRelatedPublicationsList from '@/modules/user/components/EditRelatedPublicationsList.vue';
import { mobileViewportParams } from './js/envidatViewports';

import metadata from './js/metadata';

export default {
  title: '9 Editing Metadata / Related Publication List',
  component: EditRelatedPublicationsList,
};

const relatedPubText = metadata[2].related_publications;
const multipleText =
  'Lechler, L.., Rixen, C., Bebi, P., Bavay, M., Marty, M., Barbeito, I., Dawes, M.A., Hagedorn, F., Krumm, F., Möhl, P., Schaub, M. & Frei, E.R. 2023. Fifty years of data enhance the mechanistic understanding of ecological processes in treeline ecotones under global change. In preparation.\nBavay, M., Reisecker, M., Egger, T. & Korhammer, D. 2022. Inishell 2.0: semantically driven automatic GUI generation for scientific models. Geoscientific Model Development 15(2): 365-378. https://doi.org/10.5194/gmd-15-365-2022\nBavay, M. & Egger, T. 2014. MeteoIO 2.4.2: a preprocessing library for meteorological data. Geoscientific Model Development 7(6): 3135-3151. https://doi.org/10.5194/gmd-7-3135-2014\nSchönenberger, W. & Frey, W. 1988. Untersuchungen zur Ökologie und Technik der Hochlagenaufforstung. Forschungsergebnisse aus dem Lawinenanrissgebiet Stillberg. Schweizerische Zeitschrift für Forstwesen 139(9):735-820. https://doi.org/10.5169/seals-766744\nSchönenberger, W. 1975. Standortseinflüsse auf Versuchsaufforstungen an der alpinen Waldgrenze (Stillberg, Davos), Eidg. Anst. forstl. Versuchswes. Mitt. 51(4): 358-428. Schönenberger W. (1975) Standortseinflüsse auf Versuchsaufforstungen an der alpinen Waldgrenze. (Stillberg, Davos). Gebirgsprogramm: 13. Beitrag. Mitteilungen / Eidgenössische Anstalt für das Forstliche Versuchswesen: Vol. 51/4. Birmensdorf: Eidgenössische Anstalt für das Forstliche Versuchswesen. 358-428 p.';

export const EmptyList = {
  args: {},
};

export const FilledList = {
  args: {
    relatedPublicationsText: relatedPubText,
  },
};

export const FilledListMultipleText = {
  args: {
    relatedPublicationsText: multipleText,
  },
};

export const MobileFilledList = {
  args: { ...FilledList.args },
  parameters: mobileViewportParams,
};


/*
export const MobileLargeNormalCitation = Template.bind({});
MobileLargeNormalCitation.args = { ...NormalCitation.args };
MobileLargeNormalCitation.parameters = mobileLargeViewportParams;

export const TabletNormalCitation = Template.bind({});
TabletNormalCitation.args = { ...NormalCitation.args };
TabletNormalCitation.parameters = tabletViewportParams;

export const CitationWithoutAbstract = Template.bind({});
CitationWithoutAbstract.args = {
  citation: citation1.citationText,
  doi: citation1.doi,
  doiUrl: citation1.doiUrl,
};
*/
