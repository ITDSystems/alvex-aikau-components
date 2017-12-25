# alvex-aikau-components
Generic components for use in other extensions

## Form

#### alvex/forms/FormWithWarning

Extends [alfresco/forms/Form](http://dev.alfresco.com/resource/docs/aikau-jsdoc/Form.html).
Adds warning on the bottom of the form if not all required fields are filled.

## Form Controls

#### alvex/forms/controls/BaseFormControl

Extends [alfresco/forms/controls/BaseFormControl](http://dev.alfresco.com/resource/docs/aikau-jsdoc/BaseFormControl.html).
Disables validation of the field, if field is hidden (also if section with a field is hidden).

#### alvex/forms/controls/CheckBox

Extends [alfresco/forms/controls/CheckBox](http://dev.alfresco.com/resource/docs/aikau-jsdoc/CheckBox.html).
Mixes in alvex/forms/BaseFormControl. Disables validation of the field, if field is hidden (also if section with a field is hidden).

#### alvex/forms/controls/DateTextBox

Extends [alfresco/forms/controls/DateTextBox](http://dev.alfresco.com/resource/docs/aikau-jsdoc/DateTextBox.html).
Mixes in alvex/forms/BaseFormControl. Disables validation of the field, if field is hidden (also if section with a field is hidden).

Date format: dd.MM.yyyy

If empty, uses empty string as a value (""), not null.

#### alvex/forms/controls/FilteringSelect

Extends [alfresco/forms/controls/FilteringSelect](http://dev.alfresco.com/resource/docs/aikau-jsdoc/FilteringSelect.html).
Mixes in alvex/forms/BaseFormControl. Disables validation of the field, if field is hidden (also if section with a field is hidden).

#### alvex/forms/controls/Select

Extends [alfresco/forms/controls/Select](http://dev.alfresco.com/resource/docs/aikau-jsdoc/Select.html).
Mixes in alvex/forms/BaseFormControl. Disables validation of the field, if field is hidden (also if section with a field is hidden).

#### alvex/forms/controls/TextArea

Extends [alfresco/forms/controls/TextArea](http://dev.alfresco.com/resource/docs/aikau-jsdoc/TextArea.html).
Mixes in alvex/forms/BaseFormControl. Disables validation of the field, if field is hidden (also if section with a field is hidden).

#### alvex/forms/controls/TextBox

Extends [alfresco/forms/controls/TextBox](http://dev.alfresco.com/resource/docs/aikau-jsdoc/TextBox.html).
Mixes in alvex/forms/BaseFormControl. Disables validation of the field, if field is hidden (also if section with a field is hidden).

## Inline edit property renderers

#### alvex/renderers/InlineEditDateTextBox

Extends [alfresco/renderers/InlineEditProperty](http://dev.alfresco.com/resource/docs/aikau-jsdoc/InlineEditProperty.html).
Mixes in alvex/forms/controls/DateTextBox.

#### alvex/renderers/InlineEditFilteringSelect

Extends [alfresco/renderers/InlineEditProperty](http://dev.alfresco.com/resource/docs/aikau-jsdoc/InlineEditProperty.html).
Mixes in alvex/forms/controls/FilteringSelect.
