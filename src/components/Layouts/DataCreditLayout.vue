<template>
  <v-container fluid style="min-height: 67px;">

    <v-row no-gutters>
      <v-col cols="12"
              :class="!dark ? 'white--text' : 'black--text'" >
        {{ badgesLabel }}
      </v-col>
    </v-row>
    
    <v-row no-gutters>
      <v-col v-if="!hasDataCreditCounts"
              cols="12"
              class="pt-4"
              :class="!dark ? 'white--text' : 'black--text'"       
              style="opacity: 0.65">
        {{ noCreditslabel }}
      </v-col>

      <v-col v-show="showZero || (!showZero && dataCreditCounts[index] > 0)"
              v-for="(creditName, index) in dataCreditNames"
              :key="index"
              class="shrink pt-3 pt-md-4 px-2 px-md-3" >

      <v-hover v-slot:default="{ hover }" >
        <v-badge class="dataCreditIcon"
                  bordered
                  :overlap="!hover"
                  :color="badgeColor">

          <span slot="badge"
                :class="dark ? 'white--text' : 'black--text'" >
                {{ dataCreditCounts[index] }}
          </span>

          <v-tooltip bottom >
            <template v-slot:activator="{ on }">
              <v-icon v-on="on"
                      :color="iconColor" >
                {{ iconLookup(creditName) }}
              </v-icon>
            </template >

            {{ `Author made ${dataCreditCounts[index]} ${creditName} contributions for data` }}
          </v-tooltip>
        </v-badge>
        </v-hover>
        
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'DataCreditLayout',
  components: {
  },
  props: {
    dataCredit: Object,
    iconColor: String,
    badgeColor: String,
    dark: Boolean,
    showZero: {
      type: Boolean,
      default: false,
    },
    badgesLabel: {
      type: String,
      default: 'Data Credit Badges',
    },
    noCreditslabel: {
      type: String,
      default: 'No declaration of Data Credits',
    },
  },
  computed: {
    dataCreditNames() {
      let names = [];

      if (this.dataCredit) {
        names = Object.keys(this.dataCredit);
      }

      return names;
    },
    dataCreditCounts() {
      let counts = [];

      if (this.dataCredit) {
        counts = Object.values(this.dataCredit);
      }

      return counts;
    },
    hasDataCreditCounts() {
      for (let i = 0; i < this.dataCreditCounts.length; i++) {
        const count = this.dataCreditCounts[i];
        if (count > 0) {
          return true;
        }
      }

      return false;
    },
  },
  methods: {
    iconLookup(creditName) {
      switch (creditName) {
        case 'publication':
          return 'menu_book';
        case 'software':
          return 'code';
        case 'curation':
          return 'local_library';
        case 'collection':
          return 'widgets';
        case 'validation':
          return 'record_voice_over';
        case 'supervision':
          return 'supervisor_account';
        default:
          return 'info';
      }
    },
  },
};
</script>

<style >

 .dataCreditIcon {
   opacity: 0.75;
 }

 .dataCreditBadge > span {
    bottom: -25px !important;
    right: 0px !important;
  }

  .dataCreditBadge.black--text > span > span {
    color: #000 !important;
    caret-color: #000 !important;
  }

  .dataCreditBadge.white--text > span > span {
    color: #fff !important;
    caret-color: #fff !important;
  }

</style>
