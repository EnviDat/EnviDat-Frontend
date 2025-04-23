import { ref } from 'vue';
import axios from 'axios';
import { useHead } from '@unhead/vue';

export function useSeoData() {
  const jsonLd = ref('');

  async function fetchSeoData(doi) {
    if (!doi) return;
    try {
      const cleanDoi = doi.replace('/', '_');
      const resp = await axios.get(`/envidat-doi/${cleanDoi}/metadata.json`);

      jsonLd.value = JSON.stringify(resp.data);
    } catch (error) {
      console.error(error);
    }
  }

  useHead({
    title: 'EnviDat',
    meta: [
      {
        name: 'description',
        content: 'Dominik',
      },
    ],
    script: [
      {
        type: 'application/ld+json',
        children: jsonLd,
      },
    ],
  });

  return {
    jsonLd,
    fetchSeoData,
  };
}
