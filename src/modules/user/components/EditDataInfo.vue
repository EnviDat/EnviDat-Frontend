<template>

  <v-container fluid class="pa-0 fill-height">

    <v-row>
      <v-col cols="12"
             md="5" >
        <EditDataDates :dates="dates"
                       :loading="loading"
                       :read-only-fields="readOnlyFields"
                       :read-only-explanation="readOnlyExplanation"
                       :message="message"
                       :message-details="messageDetails"
                       :error="error"
                       :error-details="errorDetails"
        />


      </v-col>

      <v-col cols="12"
             md="7" >
        <EditDataLicense :dataLicenseId="dataLicenseId"
                         :loading="loading"
                         :read-only-fields="readOnlyFields"
                         :read-only-explanation="readOnlyExplanation"
                         :message="message"
                         :message-details="messageDetails"
                         :error="error"
                         :error-details="errorDetails"
        />
      </v-col>
    </v-row>

  </v-container>

</template>

<script>/**
 * EditDataInfo.vue shows Additional Information
 *
 *
 * @summary Shows Additional Information (creation & collection dates, data license and summary)
 * @author Rebecca Kurup Buchholz, Sam Woodcock, Dominik Haas-Artho
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-11-08
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import EditDataLicense from '@/modules/user/components/EditDataLicense.vue';
import EditDataDates from '@/modules/user/components/EditDataDates.vue';


export default {
  name: 'EditDataInfo',
  props: {
    dataLicenseId: {
      type: String,
      default: '',
    },
    dates: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
    messageDetails: {
      type: String,
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
    errorDetails: {
      type: String,
      default: null,
    },
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
    },
  },
  computed: {
  },
  methods: {
  },
  components: {
    EditDataLicense,
    EditDataDates,
  },
  data: () => ({
  }),
};
</script>

<style scoped>
.heightAndScroll {
  max-height: 160px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
}
</style>
