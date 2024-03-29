/*
  Imports all vuetify components and creates a Vue component.
 */
import Vue from 'vue';
import 'skeleton-placeholder/dist/bone.min.css';

import { VBtn } from 'vuetify/lib/components/VBtn.vue';
import { VTooltip } from 'vuetify/lib/components/VTooltip.vue';
import { VIcon } from 'vuetify/lib/components/VIcon.vue';
import { VImg } from 'vuetify/lib/components/VImg.vue';
import { VFlex, VLayout, VSpacer } from 'vuetify/lib/components/VGrid.vue';
import { VParallax } from 'vuetify/lib/components/VParallax.vue';
import { VHover } from 'vuetify/lib/components/VHover.vue';
import {
  VCard, VCardActions, VCardMedia, VCardText, VCardTitle,
} from 'vuetify/lib/components/VCard.vue';
import { VChip } from 'vuetify/lib/components/VChip.vue';
import { VSlideYTransition } from 'vuetify/lib/components/transitions';
import { VAvatar } from 'vuetify/lib/components/VAvatar.vue';
import { VDivider } from 'vuetify/lib/components/VDivider.vue';
import { VForm } from 'vuetify/lib/components/VForm.vue';
import { VTextarea } from 'vuetify/lib/components/VTextarea.vue';
import {
  VToolbar,
  VToolbarItems,
  VToolbarSideIcon,
  VToolbarTitle,
} from 'vuetify/lib/components/VToolbar.vue';
import { VTextField } from 'vuetify/lib/components/VTextField';
import { VNavigationDrawer } from 'vuetify/lib/components/VNavigationDrawer';
import {
  VList,
  VListGroup,
  VListTile,
  VListTileAction,
  VListTileActionText, VListTileAvatar, VListTileContent, VListTileSubTitle, VListTileTitle,
} from 'vuetify/lib/components/VList.vue';
import { VWindow, VWindowItem } from 'vuetify/lib/components/VWindow.vue';
import { VItem, VItemGroup } from 'vuetify/lib/components/VItemGroup';
import { VBadge } from 'vuetify/lib';

Vue.component('v-avatar', VAvatar);
Vue.component('v-btn', VBtn);
Vue.component('v-badge', VBadge);
Vue.component('v-card', VCard);
Vue.component('v-card-actions', VCardActions);
Vue.component('v-card-media', VCardMedia);
Vue.component('v-card-text', VCardText);
Vue.component('v-card-title', VCardTitle);
Vue.component('v-chip', VChip);
Vue.component('v-divider', VDivider);
Vue.component('v-flex', VFlex);
Vue.component('v-form', VForm);
Vue.component('v-hover', VHover);
Vue.component('v-icon', VIcon);
Vue.component('v-img', VImg);
Vue.component('v-item', VItem);
Vue.component('v-item-group', VItemGroup);
Vue.component('v-layout', VLayout);
Vue.component('v-list', VList);
Vue.component('v-list-group', VListGroup);
Vue.component('v-list-tile', VListTile);
Vue.component('v-list-tile-action', VListTileAction);
Vue.component('v-list-tile-aciton-text', VListTileActionText);
Vue.component('v-list-tile-avatar', VListTileAvatar);
Vue.component('v-list-tile-content', VListTileContent);
Vue.component('v-list-tile-sub-title', VListTileSubTitle);
Vue.component('v-list-tile-title', VListTileTitle);
Vue.component('v-navigation-drawer', VNavigationDrawer);
Vue.component('v-parallax', VParallax);
Vue.component('v-slide-y-transition', VSlideYTransition);
Vue.component('v-spacer', VSpacer);
Vue.component('v-textarea', VTextarea);
Vue.component('v-text-field', VTextField);
Vue.component('v-toolbar', VToolbar);
Vue.component('v-toolbar-items', VToolbarItems);
Vue.component('v-toolbar-side-icon', VToolbarSideIcon);
Vue.component('v-toolbar-title', VToolbarTitle);
Vue.component('v-tooltip', VTooltip);
Vue.component('v-window', VWindow);
Vue.component('v-window-item', VWindowItem);
