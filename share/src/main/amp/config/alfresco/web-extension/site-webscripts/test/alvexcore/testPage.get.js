<import resource="classpath:alfresco/site-webscripts/org/alfresco/share/imports/share-header.lib.js">
<import resource="classpath:alfresco/site-webscripts/org/alfresco/share/imports/share-footer.lib.js">

var headerServices = getHeaderServices();
var headerWidgets = getHeaderModel("test");
headerServices.push("alfresco/services/OptionsService");
headerServices.push("alfresco/services/UserService");


headerWidgets.push({
  name: "alvex/forms/FormWithWarning",
  config: {
    widgets: [{
      name: "alvex/forms/controls/CheckBox",
      config: {
        fieldId: "TEST_CHECKBOX",
        name: "testCheckbox",
        label: "Checkbox"
      }
    }, {
      name: "alvex/forms/controls/Select",
      config: {
        name: "testSelect",
        label: "Select",
        requirementConfig: {
          initialValue: true
        },
        optionsConfig: {
          fixed: [{
            label: "Value 1",
            value: "Value1"
          }, {
            label: "Value 2",
            value: "Value2"
          }]
        },
        visibilityConfig: {
          initialValue: false,
          rules: [{
            targetId: "TEST_CHECKBOX",
            is: [true]
          }]
        }
      }
    }, {
      name: "alvex/forms/controls/FilteringSelect",
      config: {
        name: "testFilteringSelect",
        label: "Filtering Select",
        requirementConfig: {
          initialValue: true
        },
        optionsConfig: {
          labelAttribute: "name",
          queryAttribute: "name",
          valueAttribute: "nodeRef",
          publishTopic: "ALF_GET_AUTHORITIES",
          publishPayload: {
            resultsProperty: "response.data.items"
          }
        },
        visibilityConfig: {
          initialValue: false,
          rules: [{
            targetId: "TEST_CHECKBOX",
            is: [true]
          }]
        }
      }
    }, {
      name: "alfresco/forms/CollapsibleSection",
      config: {
        label: "Section that will be hidden",
        visibilityConfig: {
          initialValue: false,
          rules: [{
            topic: "_valueChangeOf_TEST_CHECKBOX",
            attribute: 'value',
            is: [true],
            strict: true
          }]
        },
        widgets: [{
          name: "alvex/forms/controls/TextBox",
          config: {
            name: "testTextBox",
            label: "TextBox",
            requirementConfig: {
              initialValue: true
            }
          }
        }, {
          name: "alvex/forms/controls/TextArea",
          config: {
            name: "testTextArea",
            label: "TextArea",
            requirementConfig: {
              initialValue: true
            }
          }
        }, {
          name: "alvex/forms/controls/DateTextBox",
          config: {
            name: "testDateTextBox",
            label: "DateTextBox",
            requirementConfig: {
              initialValue: true
            }
          }
        }]
      }
    }]
  }
});

model.jsonModel = getFooterModel(headerServices, headerWidgets);
model.jsonModel.groupMemberships = user.properties["alfUserGroups"];
