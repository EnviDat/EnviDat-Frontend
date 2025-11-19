export const workflowGuide = [
  {
    element: '#mainPageRow',
    popover: {
      title: '<strong>Welcome to the Dataset-Creation Workflow</strong>',
      description: `
            This short tour walks you through the page.<br>
            Need more help? <a href="mailto:envidat@wsl.ch">Contact us</a>.
          `,
    },
  },

  {
    element: '.navigationWorkflow',
    popover: {
      title: 'Navigation Panel',
      description: `
          <div>
            Here you can see all the steps required to publish a dataset. Please note that <b>each step</b>  must be completed and validated before you can proceed to the next one.
          </div>

          <div style="margin:10px 0">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
              <span style="width:20px;height:20px;background:#499df7;border-radius:50%;"></span>
              Current step
            </div>

            <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
              <span style="width:20px;height:20px;background:#e38c2f;border-radius:50%;"></span>
              Errors to fix
            </div>

            <div style="display:flex;align-items:center;gap:10px;">
              <span style="width:20px;height:20px;background:#40c057;border-radius:50%;"></span>
              Validated
            </div>
          </div>
        `,
    },
  },

  {
    element: '.navigationWorkflow__actions',
    popover: {
      title: 'Action Area',
      description:
        'These icons let you reopen the guide, reserve a DOI when eligible, and check the dataset’s current status.',
    },
  },

  {
    element: '.navigationWorkflow__actions .help-icon',
    popover: {
      title: 'Guide Mode',
      description: 'Click this icon at any time to restart the interactive help tour.',
    },
  },

  {
    element: '.navigationWorkflow__actions .doi-icon',
    popover: {
      title: 'Reserve DOI',
      description:
        'You can request a DOI for your dataset here <b>after you complete the Additional Information step</b>',
    },
  },

  {
    element: '.navigationWorkflow__actions .status-icon',
    popover: {
      title: 'Dataset Status',
      description:
        'This icon shows whether the dataset is still a draft, has a reserved DOI, or is already published. You can <b>see more details by clicking the icon</b>.',
    },
  },

  {
    element: '.workflow-content__wrapper',
    popover: {
      title: 'Form Area',
      description:
        'Fill in the fields for the current step. Each step covers a different aspect of your dataset and must be validated before you can move on.',
    },
  },

  {
    element: '.info-banner',
    popover: {
      title: 'Information Panel',
      description: 'Look here for additional guidance and tips specific to the step you are working on.',
    },
  },
  // {
  //   element: '.scrollToSave',
  //   popover: {
  //     title: 'Scroll-to-Save Button',
  //     description:
  //       'Click this button to jump straight to the Save section.',
  //   },
  // },
];
