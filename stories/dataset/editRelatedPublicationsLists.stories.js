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
import { EDITMETADATA_CLEAR_PREVIEW, EDITMETADATA_OBJECT_UPDATE, eventBus } from '@/factories/eventBus';
import { mobileViewportParams } from '@/../stories/js/envidatViewports';

import metadata from '@/../stories/js/metadata';

export default {
  title: '3 Datasets / 2 Edit / Related Publication List',
};

const relatedPubText = metadata[2].related_publications;
const multipleText =
  '**Markdown stuff** [https://www.google.com](https://www.google.com) \n Lechler, L.., Rixen, C., Bebi, P., Bavay, M., Marty, M., Barbeito, I., Dawes, M.A., Hagedorn, F., Krumm, F., Möhl, P., Schaub, M. & Frei, E.R. 2023. Fifty years of data enhance the mechanistic understanding of ecological processes in treeline ecotones under global change. In preparation.\nBavay, M., Reisecker, M., Egger, T. & Korhammer, D. 2022. Inishell 2.0: semantically driven automatic GUI generation for scientific models. Geoscientific Model Development 15(2): 365-378. https://doi.org/10.5194/gmd-15-365-2022\nBavay, M. & Egger, T. 2014. MeteoIO 2.4.2: a preprocessing library for meteorological data. Geoscientific Model Development 7(6): 3135-3151. https://doi.org/10.5194/gmd-7-3135-2014\nSchönenberger, W. & Frey, W. 1988. Untersuchungen zur Ökologie und Technik der Hochlagenaufforstung. Forschungsergebnisse aus dem Lawinenanrissgebiet Stillberg. Schweizerische Zeitschrift für Forstwesen 139(9):735-820. https://doi.org/10.5169/seals-766744\nSchönenberger, W. 1975. Standortseinflüsse auf Versuchsaufforstungen an der alpinen Waldgrenze (Stillberg, Davos), Eidg. Anst. forstl. Versuchswes. Mitt. 51(4): 358-428. Schönenberger W. (1975) Standortseinflüsse auf Versuchsaufforstungen an der alpinen Waldgrenze. (Stillberg, Davos). Gebirgsprogramm: 13. Beitrag. Mitteilungen / Eidgenössische Anstalt für das Forstliche Versuchswesen: Vol. 51/4. Birmensdorf: Eidgenössische Anstalt für das Forstliche Versuchswesen. 358-428 p.';

const LegacyText = '*  blabla'; // '* wsl:29664';

const Template = {
  render: (args, { argTypes }) => ({
    components: { EditRelatedPublicationsList },
    props: Object.keys(argTypes),
    template: `<EditRelatedPublicationsList
                  v-bind="$props"
                  :relatedPublicationsText="newText"
      />`,
    created() {
      eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.updateRelatedtext);
    },
    beforeUnmount() {
      eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.updateRelatedtext);
    },
    mounted() {
      this.newText = this.$props.relatedPublicationsText;
    },
    methods: {
      updateRelatedtext(updatedObject) {
        eventBus.emit(EDITMETADATA_CLEAR_PREVIEW)
        setTimeout(() => {
          this.newText = updatedObject.data.relatedPublicationsText;
        }, 1000);
      },
    },
    data: () => ({
      newText: '',
    }),
  }),
};

export const EmptyList = {
  ...Template,
  args: {},
};

export const FilledList = {
  ...Template,
  args: {
    relatedPublicationsText: relatedPubText,
  },
};

export const FilledListMultipleText = {
  ...Template,
  args: {
    relatedPublicationsText: multipleText,
  },
};

export const FilledListLegacyText = {
  ...Template,
  args: {
    relatedPublicationsText: LegacyText,
  },
};

export const MobileFilledList = {
  ...Template,
  args: { ...FilledList.args },
  parameters: mobileViewportParams,
};

