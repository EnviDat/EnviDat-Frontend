import Vue from 'vue';
// loads all components
import Vuetify from 'vuetify';
// all the css for components
import 'vuetify/dist/vuetify.min.css'; 
// load the icon font
import 'material-design-icons-iconfont/dist/material-design-icons.css';

import config from '../src/plugins/vuetifyConfig';

Vue.use(Vuetify);

export default new Vuetify(config);