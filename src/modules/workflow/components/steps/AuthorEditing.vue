<script setup lang="ts">
import { computed, ref } from 'vue';

import {
  mdiAccount,
  mdiClose,
  mdiEmail,
  mdiHandshake,
  mdiWalletMembership,
} from '@mdi/js';

import BaseUserPicker from '@/components/BaseElements/BaseUserPicker.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

import { EDIT_METADATA_ADD_AUTHOR_TITLE } from '@/factories/metadataConsts';

import {
  createAuthor,
  getUserNameObjects,
  getAuthorByEmail,
  getAuthorByName,
  getAuthorName,
} from '@/factories/authorFactory';

import {
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
  REMOVE_EDITING_AUTHOR,
} from '@/factories/eventBus';

import { isFieldReadOnly, readOnlyHint as getReadOnlyHint } from '@/factories/globalMethods';

const props = defineProps({
  titleLabel: {
    type: String,
    default: EDIT_METADATA_ADD_AUTHOR_TITLE,
  },
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  identifier: {
    type: String,
    default: '',
  },
  affiliation: {
    type: String,
    default: '',
  },
  existingAuthors: {
    type: Array,
    default: () => [],
  },
  isEditingAuthor: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
  messageDetails: {
    type: String,
    default: null,
  },
  error: {
    type: String,
    default: '',
  },
  errorDetails: {
    type: String,
    default: null,
  },
  readOnlyFields: {
    type: Array,
    default: () => [],
  },
  readOnlyExplanation: {
    type: String,
    default: '',
  },
  validationErrors: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits([
  'save',
  'closeClicked',
]);

const authorIsPicked = ref(false);
const authorPickerTouched = ref(false);

const previews = ref({
  email: null,
  identifier: null,
  affiliation: null,
  firstName: null,
  lastName: null,
});

const labels = {
    labelEmail: 'Email',
    labelFirstName: 'First Name',
    labelLastName: 'Last Name',
    labelIdentifier: 'Identifier - OrcId',
    labelAffiliation: 'Affiliation',
    placeholderEmail: 'Enter author email address',
    placeholderFirstName: 'Enter author first name',
    placeholderLastName: 'Enter author last name',
    placeholderIdentifier: 'Enter the authors OrcId',
    placeholderAffiliation: 'Enter authors affiliation',
    authorInstructions: 'Enter an email address of the author.',
    authorOr: '<strong>Or</strong> pick an existing author',
    authorAutoComplete:
  'If an author is picked or found with the email address these fields are <strong>autocompleted</strong>!',
    authorPickHint:
  'Start typing the name in the text field to search for an author.',
};


const activeElements = ref({
  email: null,
  identifier: null,
  affiliation: null,
  firstName: null,
  lastName: null,
});

const loadingColor = computed(() => {
  if (props.loading) {
    return 'accent';
  }

  return undefined;
})

const firstNameField = computed(() => previews.value.firstName !== null
    ? previews.value.firstName
    : props.firstName)

const lastNameField = computed(() => previews.value.lastName !== null
    ? previews.value.lastName
    : props.lastName)

const emailField = computed(() => previews.value.email !== null ? previews.value.email : props.email)

const identifierField = computed(() => previews.value.identifier !== null
    ? previews.value.identifier
    : props.identifier)

const affiliationField = computed(() => previews.value.affiliation !== null
  ? previews.value.affiliation
  : props.affiliation)

const preselectAuthorNames = computed( () => {
  const author = getAuthorByEmail(emailField.value, props.existingAuthors);

  if (author) {
    const fullName = getAuthorName(author);
    return fullName ? [fullName] : [];
  }

  return undefined;
})

const fullNameUsers = computed(() => {
  const localAuthors = [...props.existingAuthors];
  return getUserNameObjects(localAuthors);
})


const anyUserElementsActive = computed(()=> (
    activeElements.value.email ||
    activeElements.value.firstName ||
    activeElements.value.lastName ||
    activeElements.value.affiliation ||
    activeElements.value.identifier
  ))

const anyPreviewsChanged = computed(()=> (
    previews.value.email !== null ||
    previews.value.firstName !== null ||
    previews.value.lastName !== null ||
    previews.value.affiliation !== null ||
    previews.value.identifier !== null
  ))

const editAuthorInstructions = computed(()=> {
  if (props.isEditingAuthor) {
    return `Change the information of ${getAuthorName({ firstName: props.firstName, lastName: props.lastName })} for this dataset.`;
  }

  return 'Create a new author which is not on any published dataset.';
})

const isReadOnly = (dateProperty) => isFieldReadOnly(props, dateProperty)

const readOnlyHint = (dateProperty) => getReadOnlyHint(props, dateProperty)

const isUserPickerReadOnly = computed(()=> isReadOnly('authors'))



const fillPreviews = (email, firstName, lastName, identifier, affiliation) => {
  previews.value.email = email;
  previews.value.firstName = firstName;
  previews.value.lastName = lastName;
  previews.value.identifier = identifier;
  previews.value.affiliation = affiliation;
}

const blurOnEnterKey = (keyboardEvent) => {
  if (keyboardEvent.key === 'Enter') {
    keyboardEvent.target.blur();
  }
}

const markPropertyActive = (toElement, editing) => {
  const toId = toElement?.id || null;
  if (toId) {
    activeElements.value[toId] = editing;
  }
}



const focusIn = (event) => {
  markPropertyActive(event.target, true);
}

const changeProperty = (property, value) => {
  previews.value[property] = value;
  // validateProperty(property, value);
}


const saveAuthorInfo = (authorObject) => {
  emit('save', authorObject);
}


const catchPickerAuthorChange = (pickedAuthorName, hasAuthor) => {
  authorPickerTouched.value = true;
  authorIsPicked.value = hasAuthor;

  if (authorIsPicked.value) {
    const author =
      getAuthorByName(pickedAuthorName, props.existingAuthors) || {};
    const authorObject = createAuthor(author);

    fillPreviews(
      authorObject.email,
      authorObject.firstName,
      authorObject.lastName,
      authorObject.identifier,
      authorObject.affiliation,
    );

    saveAuthorInfo(authorObject);

  } else {
    // has to be an empty string here otherwise the old value (via $props)
    // would be shown
    fillPreviews('', '', '', '', '');
  }
}

const getAutoCompletedAuthor = (email) => {
  const autoAuthor = getAuthorByEmail(email, props.existingAuthors);

  if (autoAuthor) {
    const autoAuthorObj = createAuthor(autoAuthor);

    fillPreviews(
      autoAuthorObj.email,
      autoAuthorObj.firstName,
      autoAuthorObj.lastName,
      autoAuthorObj.identifier,
      autoAuthorObj.affiliation,
    );

    // this makes the text-fields readonly again
    authorPickerTouched.value = false;

    return autoAuthorObj;
  }

  return null;
}

const notifyAuthorChange = (value) => {
  if (anyUserElementsActive.value) {
    return;
  }

  if (!anyPreviewsChanged.value) {
    return;
  }

  const authorObj = {
    firstName: firstNameField.value,
    lastName: lastNameField.value,
  };

  const fullName = getAuthorName(authorObj);
  // default to filling all the infos from the text-field input
  // so that single text-field changes are captured too
  let authorObject = createAuthor({
    ...authorObj,
    fullName,
    email: emailField.value,
    identifier: identifierField.value,
    affiliation: affiliationField.value,
  });


  const autoAuthor = getAutoCompletedAuthor(value);
  if (autoAuthor) {
    authorObject = autoAuthor;
  }

  saveAuthorInfo(authorObject);
}

const focusOut = (property: string, event: Event) => {
  markPropertyActive(event.target, false);
  markPropertyActive(event.relatedTarget, true);
  // this.delayedNotifyChange(property, event.target.value);
  notifyAuthorChange(event.target.value);
}


const removeAuthorClick = (email) => {
  eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
    object: REMOVE_EDITING_AUTHOR,
    data: email,
  });
}


</script>

<template>
  <v-card id="AuthorEditing"
          class="pa-0"
          :loading="loadingColor"
  >
    <BaseIconButton
      v-if="isEditingAuthor"
      class="editResourceCloseButton ma-2"
      :class="{ 'mx-1': $vuetify.display.smAndDown }"
      style="position: absolute; top: 0; right: 0; z-index: 2"
      :icon="mdiClose"
      icon-color="black"
      color="black"
      outlined
      tooltip-text="Cancel author editing"
      tooltip-bottom
      @clicked="emit('closeClicked')"
    />

    <v-container fluid class="pa-4">
      <v-row>
        <v-col class="text-h5" cols="8">
          {{ titleLabel }}
        </v-col>

        <v-col v-if="message" cols="4" class="pl-16">
          <BaseStatusLabelView
            status="check"
            statusColor="success"
            :statusText="message"
            :expandedText="messageDetails"
          />
        </v-col>

        <v-col v-if="error" cols="4" class="pl-16">
          <BaseStatusLabelView
            status="error"
            statusColor="error"
            :statusText="error"
            :expandedText="errorDetails"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-body-1 pb-0">
          {{ editAuthorInstructions }}
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-body-1">
          {{ labels.authorInstructions }}
        </v-col>
      </v-row>

      <v-row dense class="pt-2">
        <v-col>
          <v-text-field
            ref="email"
            id="email"
            :label="labels.labelEmail"
            :error-messages="validationErrors.email"
            :readonly="isReadOnly('authors')"
            :hint="readOnlyHint('authors')"
            :prepend-icon="mdiEmail"
            :placeholder="labels.placeholderEmail"
            :model-value="emailField"
            @keyup="blurOnEnterKey"
            @focusin="focusIn($event)"
            @focusout="focusOut('email', $event)"
            @input="changeProperty('email', $event.target.value)"
          />
        </v-col>
      </v-row>

      <v-row v-if="!isEditingAuthor" no-gutters dense>
        <v-col class="text-body-1" v-html="labels.authorOr"> </v-col>
      </v-row>

      <v-row v-if="!isEditingAuthor" dense class="pt-2">
        <v-col>
          <BaseUserPicker
            :users="fullNameUsers"
            :preSelected="preselectAuthorNames"
            :readonly="isUserPickerReadOnly"
            :hint="
              isUserPickerReadOnly
                ? readOnlyHint('authors')
                : labels.authorPickHint
            "
            @removedUsers="catchPickerAuthorChange($event, false)"
            @pickedUsers="catchPickerAuthorChange($event, true)"
          />
        </v-col>
      </v-row>

      <v-row class="px-4" dense>
        <v-col class="text-body-1" v-html="labels.authorAutoComplete"> </v-col>
      </v-row>

      <v-row dense class="pt-2 px-4">
        <v-col>
          <v-text-field
            ref="firstName"
            id="firstName"
            :label="labels.labelFirstName"
            :error-messages="validationErrors.firstName"
            :prepend-icon="mdiAccount"
            :placeholder="labels.placeholderFirstName"
            :model-value="firstNameField"
            :readonly="isReadOnly('authors')"
            :hint="readOnlyHint('authors')"
            @keyup="blurOnEnterKey"
            @focusin="focusIn($event)"
            @focusout="focusOut('firstName', $event)"
            @input="changeProperty('firstName', $event.target.value)"
          />
        </v-col>

        <v-col class="pl-4">
          <v-text-field
            ref="lastName"
            id="lastName"
            :label="labels.labelLastName"
            :error-messages="validationErrors.lastName"
            :prepend-icon="mdiAccount"
            :placeholder="labels.placeholderLastName"
            :model-value="lastNameField"
            :readonly="isReadOnly('authors')"
            :hint="readOnlyHint('authors')"
            @keyup="blurOnEnterKey"
            @focusin="focusIn($event)"
            @focusout="focusOut('lastName', $event)"
            @input="changeProperty('lastName', $event.target.value)"
          />
        </v-col>
      </v-row>

      <v-row dense class="px-4">
        <v-col>
          <v-text-field
            ref="affiliation"
            id="affiliation"
            :label="labels.labelAffiliation"
            :error-messages="validationErrors.affiliation"
            :prepend-icon="mdiHandshake"
            :placeholder="labels.placeholderAffiliation"
            :model-value="affiliationField"
            :readonly="isReadOnly('authors')"
            :hint="readOnlyHint('authors')"
            @keyup="blurOnEnterKey"
            @focusin="focusIn($event)"
            @focusout="focusOut('affiliation', $event)"
            @input="changeProperty('affiliation', $event.target.value)"
          />
        </v-col>

        <v-col class="pl-4">
          <v-text-field
            ref="identifier"
            id="identifier"
            :label="labels.labelIdentifier"
            :error-messages="validationErrors.identifier"
            :prepend-icon="mdiWalletMembership"
            :placeholder="labels.placeholderIdentifier"
            :model-value="identifierField"
            :readonly="isReadOnly('authors')"
            :hint="readOnlyHint('authors')"
            @keyup="blurOnEnterKey"
            @focusin="focusIn($event)"
            @focusout="focusOut('identifier', $event)"
            @input="changeProperty('identifier', $event.target.value)"
          />
        </v-col>
      </v-row>

      <v-row v-if="isEditingAuthor">
        <v-col>
          <BaseRectangleButton
            :icon="mdiClose"
            icon-color="white"
            color="error"
            :disabled="isReadOnly('authors')"
            button-text="Remove Author"
            tooltip-text="Remove this author from the dataset"
            @clicked="removeAuthorClick(email)"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>

</template>

<style scoped>

</style>
