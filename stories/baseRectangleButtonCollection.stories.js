/**
 * @summary story of BaseRectangleButton for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-07-15 09:43:06
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

export default {
  title: '1 Base Elements / Rectangle Buttons Collection',
  component: BaseRectangleButton,
};

const Template = (args, { argTypes }) => ({
  components: { BaseRectangleButton },
  props: Object.keys(argTypes),
  template: '<BaseRectangleButton v-bind="$props" />',
});

export const SingleButton = Template.bind({});
SingleButton.args = {
  buttonText: 'Single Button',
  isOutlined: true,
  materialIconName: 'edit',
}

/*
SingleButton.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);

  const btn = canvas.getByText('Single Button', {
    selector: 'span',
  });

  await expect(btn).toBeInTheDocument();
}
*/


export const ButtonsCollectionViews = () => ({
    components: { BaseRectangleButton },
    template: `
    <v-row >

      <v-col cols="4">
        <base-rectangle-button
          buttonText="normal button"
          tooltipText="Text for the tool tip" />
      </v-col>
      <v-col cols="4">
        <base-rectangle-button
          buttonText="normal button"
          isOutlined
          tooltipText="Text for the tool tip" />
      </v-col>
      <v-col cols="4">
        <base-rectangle-button
          buttonText="normal button"
          isFlat
          tooltipText="Text for the tool tip" />
      </v-col>

      <v-col cols="4">
        <base-rectangle-button
          buttonText="secondary color"
          color="secondary"
          tooltipText="Text for the tool tip" />
      </v-col>
      <v-col cols="4">
        <base-rectangle-button
          buttonText="secondary color"
          color="secondary"
          isOutlined
          tooltipText="Text for the tool tip" />
      </v-col>
      <v-col cols="4">
        <base-rectangle-button
          buttonText="secondary color"
          color="secondary"
          isFlat
          tooltipText="Text for the tool tip" />
      </v-col>

      <v-col cols="4">
        <base-rectangle-button
          buttonText="accent color"
          color="accent"
          tooltipText="Text for the tool tip" />
      </v-col>
      <v-col cols="4">
        <base-rectangle-button
          buttonText="accent color"
          color="accent"
          isOutlined
          tooltipText="Text for the tool tip" />
      </v-col>
      <v-col cols="4">
        <base-rectangle-button
          buttonText="accent color"
          color="accent"
          isFlat
          tooltipText="Text for the tool tip" />
      </v-col>

      <v-col cols="4">
        <base-rectangle-button
          buttonText="small button"
          isSmall
          tooltipText="Text for the tool tip" />
      </v-col>
      <v-col cols="4">
        <base-rectangle-button
          buttonText="small button"
          isSmall
          isOutlined
          tooltipText="Text for the tool tip" />
      </v-col>
      <v-col cols="4">
        <base-rectangle-button
          buttonText="small button"
          isSmall
          isFlat
          tooltipText="Text for the tool tip" />
      </v-col>

      <v-col cols="4">
        <base-rectangle-button
          buttonText="small button"
          isSmall
          disabled
          tooltipText="Text for the tool tip" />
      </v-col>
      <v-col cols="4">
        <base-rectangle-button
          buttonText="small button"
          isSmall
          isOutlined
          disabled />
      </v-col>
      <v-col cols="4">
        <base-rectangle-button
          buttonText="small button"
          isSmall
          isFlat
          disabled
          tooltipText="Text for the tool tip" />
      </v-col>

      <v-col cols="4">
        <base-rectangle-button
          buttonText="Xs small button"
          isXsSmall
          tooltipText="Text for the tool tip" />
      </v-col>
      <v-col cols="4">
        <base-rectangle-button
          buttonText="Xs small button"
          isXsSmall
          isOutlined
          tooltipText="Text for the tool tip" />
      </v-col>
      <v-col cols="4">
        <base-rectangle-button
          buttonText="Xs small button"
          isXsSmall
          isFlat
          tooltipText="Text for the tool tip" />
      </v-col>

      <v-col cols="4">
        <base-rectangle-button
          buttonText="button with icon"
          materialIconName="edit"
          iconColor="white" />
      </v-col>
      <v-col cols="4">
        <base-rectangle-button
          buttonText="button with icon"
          materialIconName="add"
          iconColor="secondary"
          isOutlined />
      </v-col>


      <v-col cols="4">
        <base-rectangle-button
          buttonText="button with icon"
          materialIconName="search"
          isFlat
          disabled />
      </v-col>

      <v-col cols="4">
        <base-rectangle-button
          buttonText="Hover for Tooltip"
          tooltipText="Text for the tool tip" />
      </v-col>

      <v-col cols="4">
          <base-rectangle-button
          buttonText="Hover for Tooltip"
          isSmall
          isOutlined
          tooltipText="Text for the tool tip" />
      </v-col>

      <v-col cols="4">
          <base-rectangle-button
          buttonText="Hover for Tooltip"
          tooltipText="Text for the tool tip"
          isFlat
          disabled />
      </v-col>

      <v-col cols="4">
          <base-rectangle-button
          buttonText="Hover for Tooltip"
          isXsSmall
          tooltipText="Text for the tool tip"  />
      </v-col>

    </v-row>`,
  });
