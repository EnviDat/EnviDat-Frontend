<template>
  <v-container class="pa-0 mt-10">
    <v-container class="pa-0 pa-md-6">
      <v-row no-gutters class="align-center">
        <v-col cols="12">
          <v-img
            class="envidat-img"
            alt="envidat_logo"
            :style="[backgroundStyle, dynamicImgStyle]"
          />

          <div
            class="envidatSlogan text-h3 text-md-h2 pb-5 mb-5 mb-md-0 font-weight-bold envidat-slogan"
            :style="dynamicSloganStyle"
          >
            {{ slogan }}
          </div>

          <div
            :class="{
              'pb-5 mb-5': hasButtons,
              'pb-0': !hasButtons,
              'text-h6': true,
              'envidat-subSlogan': true,
            }"
            style="text-align: center;"
            v-html="subSlogan"
          ></div>
        </v-col>

        <base-rectangle-button
          v-if="buttonText && buttonCallback"
          :button-text="buttonText"
          @clicked="buttonCallback"
        />
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue'

const props = defineProps({
  slogan: {
    type: String,
    default: '',
  },
  sloganImg: {
    type: String,
    default: '',
  },
  subSlogan: {
    type: String,
    default: '',
  },
  maxHeight: Number,
  buttonText: {
    type: String,
    default: '',
  },
  buttonCallback: {
    type: Function,
    default: null,
  },
  moreButtonText: {
    type: String,
    default: '',
  },
  moreButtonCallback: {
    type: Function,
    default: null,
  },
})

const EnviDatBase64 = ref(
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAC8VBMVEUAAAB601MsqqpbujBC4+NDz89Dz89IWFlD2NklyMhatDHT8cZaui8vuLlD0NBDz88wubpDz88vuLldvDJbujBaui8vubswubpbujAvubo6zc0zy8vW9fVD0NBDz88wubowubpDz88Snp45kJFGdHVVWDFLa2tGgYFDz9AosrIboqJQXV1TcEdozTvd9tQ1nJs/hYZPaU5l2dnJ7rlLSEFVhzxzv1FIi4tEu7hbui/I7rlIsRlEysf////1//9DwMGC112B4ODg+Piy7u7o+vpRQTNCrxE/fH1hkE0uo6NQYz8mp6csycnT9fXA662a3nzu/PyW2XpbujBi0rlHr69Hn6BOtCA1ralFmoeN2muT5uaE09N92lRyzklqzj9H0dHI8PB0ycmp45CH02S76emp5+dbujBbujDR8MNlvj1X2tqj4ohMfWBLkXNGhHOj2tpfv79Nt7fL7ry45aRx3Nx8y1lD0NDI7bh601MytrNdph5HlZWd6elHqqcyurVVtylT1NRBs7Sy55uX399Iz88utLUwubpDz8/K7rpKYWFapjpdiRq1559tp1Ts++VbujA7o5RIsaFkuz5gw8NGb29F1dhDz89LYmNdvCY/hIUqrq5dzStSc0N601NC0tJUczXU8ceO2mxDz8961FPF7LRqxkEtucVfqCFBus4vpbtUVSlXWC0+2vTH7bcnvtp601MkoqJEYWLH7bbI7bgsqqpFbGzQ8cJDz89bujAwubp601MsqqpbuDBCzs5HZWUryspMU0pC3+BcuzF40lFdzitIYGBcxi0twcMwuLhbwC5801Ztz0NdyiwmtrZOXEpQZEgvvL5MVlaD61VC09RA5e5D0dEJm5t00UpUTSsozNRNSkksxsd+3lRMUlNITk9XoDVUtigrra0kpqZbvDBB5OZC29tEuLg2o6RVkjlZuS1ezCwqx880sLFSekBZqzQqwc1FPklPWT5exCNK0dGC4VhTtFBTaDlYdCZhuxRhrhF/4VQzOa/9AAAAt3RSTlMA8vLz/mdw/P7+EfyQERDu7o8uLe7R0I5wS/7+8LTRs3Au/fz8/Pv6S/7+/v7++/v6+PP+/v77+vdKSf78+/v5+fb19f7+/vz8+/v5+Pf19fPrswb9/fz49/bx8f74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',
)


const backgroundStyle = computed(() => ({
  backgroundImage: `url(${EnviDatBase64.value})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}))


const { smAndDown, mdAndUp } = useDisplay()

const dynamicImgStyle = computed(() => {
  if (smAndDown.value) {
    return {
      width: '70px',
      height: '70px',
      margin: '0 auto 2rem auto',
    }
  }

  return {
    width: '150px',
    height: '150px',
    margin: '2rem auto',
  }
})

const dynamicSloganStyle = computed(() => {
  if (smAndDown.value) {
    return {
      lineHeight: '3.6rem',
      textAlign: 'center',
    }
  }
  return {
    lineHeight: '4.6rem',
    textAlign: 'center',
  }
})

const hasButtons = computed(() =>
  (props.moreButtonText && props.moreButtonCallback) ||
  (props.buttonText && props.buttonCallback),
)

</script>

<style scoped>
.envidat-slogan, .envidat-subSlogan {
  position: relative;
}

</style>
