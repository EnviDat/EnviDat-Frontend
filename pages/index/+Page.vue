<template>
  <div>
    <h1>{{ data.title }}</h1>

<!--
  <v-container>
    Test
  </v-container>
-->

<!--
  <LandingPageLayout
    :categoriesTitle="defaultWelcomeInfo.categoriesTitle"
    :datasetsTitle="defaultWelcomeInfo.datasetsTitle"
    :datasetsTotal="datasetsTotal"
    :newsTitle="defaultWelcomeInfo.newsTitle"
    :infoTitle="defaultWelcomeInfo.infoTitle"
    :articlesTitle="defaultWelcomeInfo.articlesTitle"
  >
    &lt;!&ndash; Welcome slot &ndash;&gt;
    <template #welcome>
      <SloganCard
        class="pa-md-6 pt-md-0"
        :slogan="defaultWelcomeInfo.Slogan"
        :subSlogan="defaultWelcomeInfo.SubSlogan"
        :maxHeight="200"
        buttonText="EXPLORE DATA"
        moreButtonText="ABOUT ENVIDAT"
      />

&lt;!&ndash;
      <SearchBarView
        v-if="isMediumScreenAndDown"
        :labelText="
          display.xs
            ? defaultWelcomeInfo.smallSearchLabelText
            : defaultWelcomeInfo.searchLabelText
        "
        :buttonText="buttonsActions"
        :hasButton="true"

      />
&ndash;&gt;

      <v-row justify="center" class="flex-grow-0" no-gutters>
        &lt;!&ndash; noMode Category &ndash;&gt;
        <v-col
          v-for="card in categoryCardsNoMode"
          :key="card.title"
          class="pa-2"
          cols="auto"
        >
          <BaseCategoryCard
            height="45"
            :title="card.title"
            :img="card.imgPath"
            :icon="card.iconPath"
            :color="card.darkColor"
            :isMode="card.isMode"
            :contain="card.contain"
            :disabled="card.disabled"
          />
        </v-col>
      </v-row>
      <v-row justify="center" class="flex-grow-0" no-gutters>
        &lt;!&ndash; Mode Category &ndash;&gt;
        <v-col
          v-for="card in categoryCardsMode"
          :key="card.title"
          class="pa-2 d-block"
          cols="auto"
        >
          <BaseCategoryCard
            height="45"
            :elevation="5"
            :title="card.title"
            :img="card.imgPath"
            :icon="card.iconPath"
            :color="card.darkColor"
            :isMode="card.isMode"
            :contain="card.contain"
            :disabled="card.disabled"
          />
        </v-col>
      </v-row>
    </template>

    &lt;!&ndash; Search slot &ndash;&gt;
    <template #search>
      <SearchBarView
        :labelText="defaultWelcomeInfo.searchLabelText"
        :buttonText="buttonsActions"
        :hasButton="true"
      />
    </template>

    &lt;!&ndash; Datasets slot &ndash;&gt;
    <template #datasets>
      <v-row>
        <v-col
          v-for="(metadata, index) in recentMetadata"
          :key="index"
          cols="12"
          md="6"
          xl="3"
        >
          <BaseCardLandingPage
            :cardType="'metadata'"
            :truncateSubTilte="true"
            :categoryBelow="true"
            :id="metadata.id"
            :title="metadata.title"
            :subtitle="metadata.notes"
            :categoryName="metadata.categoryName"
            :categoryColor="metadata.categoryColor"
            :date="metadata.metadata_created"
          />
        </v-col>
      </v-row>
    </template>

    &lt;!&ndash; Info slot &ndash;&gt;
    <template v-if="defaultWelcomeInfo.infoConfig.infoActive" #info>
      <v-row class="justify-center">
        <v-col v-for="(info, i) in defaultWelcomeInfo.infoConfig.info" :key="i" cols="12" lg="4">
          <InfoCards :index="i" :info="info" />
        </v-col>
      </v-row>
    </template>

    <template #contact>
      <v-row>
        <v-col cols="12">
          <v-container> <LandingPageContactForm /> </v-container>
        </v-col>
      </v-row>
    </template>

  </LandingPageLayout>
-->

    <a :href="`/metadata/${data.name}`" >{{ data.name }}</a>
  </div>
</template>

<script setup lang="ts">

import { useData } from 'vike-vue/useData'
import { DatasetDTO } from '@/types/modelTypes';

const data = useData<DatasetDTO>()
</script>

<style scoped>
</style>
