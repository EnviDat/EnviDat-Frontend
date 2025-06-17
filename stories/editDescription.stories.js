/* eslint-disable object-property-newline */
/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-09-06 15:11:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import EditDescription from '@/modules/user/components/EditDescription.vue';
import { EditDescriptionViewModel } from '@/modules/workflow/viewModel/EditDescriptionViewModel';
import {
  mobileLargeViewportParams,
  mobileViewportParams,
  tabletViewportParams,
} from './js/envidatViewports';
import { DatasetModel } from '@/modules/workflow/viewModel/DatasetModel.ts';
import { EditDatasetBackendService } from '@/modules/workflow/viewModel/EditDatasetBackendService.ts';

const description = `# Why user stories?
&nbsp;
User Stories can help you to constantly improve the value of
your product, estimate development efforts in an appropriate way and prioritize
feature development during the MVP and post-MVP stages.
&nbsp;
# How user stories
&nbsp;
## 1. Step think about "Who" - type of user
&nbsp;
Try to omit using such a role as simply
“the user”. It can be applied to any person - from your customers to admins -
and, therefore, it doesn’t reflect the personality of particular target groups,
the way they interact with the application. You can create personas.
&nbsp;
## 2. Step think about the "What" - function, UI & UX
&nbsp;
Define what functionality each user expects. How she’s going to interact with the app.
&nbsp;
## 3. Step think about the "Why" - added value
&nbsp;
It should either improve the UX, increase retention rates,
shorten users’ journey to the issue solution or whatever. Each Story should
contribute something to the general goal of your product.
`;


export default {
  title: '3 Datasets / 2 Edit / Description',
  component: EditDescription,
};

const vm = new EditDescriptionViewModel(new DatasetModel(new EditDatasetBackendService({
  notes: description,
})))

export const Empty = {}

export const Filled = {
  args: vm,
}

export const FilledMobile = {
  args: vm,
  parameters: mobileViewportParams,
}

export const FilledLargeMobile = {
  args: vm,
  parameters: mobileLargeViewportParams,
}

export const FilledTablet = {
  args: vm,
  parameters: tabletViewportParams,
}
