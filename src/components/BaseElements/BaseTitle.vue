<template>
    <div>
      <div :class="className">{{ text }}</div>
    </div>
  </template>

  <script>
  export default {
    name: 'BaseTitle',
    props: {
      text: {
        type: String,
        required: true,
      },
      className: {
        type: String,
        default: 'text-h5',
      },
    },
  };
  </script>
