define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/ObjectProcessingMixin",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/core/ObjectTypeUtils",
        "alfresco/core/topics"
    ],
    function(BaseFormControl, declare, CoreWidgetProcessing, ObjectProcessingMixin, lang, array, ObjectTypeUtils, topics) {
        return declare([BaseFormControl, CoreWidgetProcessing, ObjectProcessingMixin], {
            i18nRequirements: [{i18nFile: "./i18n/FileUploader.properties"}],
            itemKeyProperty: "nodeRef",
            multipleItemMode: false,
            itemsToShow: null,
            filterMimeType: "",
            valueDelimiter: ",",
            configureValidation: function alvex_forms_controls_FileUploader__configureValidation() {
                if (this.requirementConfig && this.requirementConfig.initialValue === true) {
                    if (!this.validationConfig || !ObjectTypeUtils.isArray(this.validationConfig)) {
                        this.validationConfig = [];
                    }
                    this.validationConfig.push({
                        validation: "minLength",
                        length: 1,
                        errorMessage: "uploader.error.mandatory"
                    });
                }
            },
            setupSubTopics: function alvex_forms_controls__FileUploader_setupSubTopics () {
                this.updateSelectedItemsTopic = this.generateUuid() + "_updateSelectedItemsTopic";
                this.removeItemTopic = this.generateUuid() + "_removeItemTopic";
                this.alfSubscribe(this.removeItemTopic, lang.hitch(this, this.onItemRemoved), true);
                this.alvexUploadResponseTopic = this.generateUuid();
                this.alfSubscribe(this.alvexUploadResponseTopic, lang.hitch(this, this.onFileUploadResult), true);
            },

            onFileUploadResult: function alvex_forms_controls__FileUploader_onFileUploadResult(payload) {
                if ((payload.isUploaded) &&(payload.response.nodeRef != null)) {
                    var responseTopic = this.generateUuid()+"_FileUpl_";
                    var handle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, function(payload) {
                        !!!this.value && (this.value = []);
                        !!!this.itemsToShow && (this.itemsToShow = []);
                        var oldValue = this.value;
                        var updatedValue = this.value;
                        this.alfUnsubscribe(handle);
                        var updatedFile = payload.response.item;
                        this.normaliseFile(updatedFile);
                        var nodeRef = lang.getObject("nodeRef", false, updatedFile);
                        if (this.multipleItemMode) {
                            this.itemsToShow.push(updatedFile);
                            updatedValue.push(nodeRef);
                        }
                        else {
                            updatedValue = [nodeRef];
                            this.itemsToShow = [updatedFile];
                        }
                        this.value = updatedValue;
                        this.onValueChangeEvent(this.name, oldValue, updatedValue);
                        this.updateSelectedItems(this.updateSelectedItemsTopic);
                    }), true);
                    this.alfServicePublish(topics.GET_DOCUMENT, {
                        alfResponseTopic: responseTopic,
                        nodeRef: payload.response.nodeRef
                    });
                } else
                {
                    // Handle upload failure by removing the lock from the form.
                    // It's possible that we need to throw one more GOST_UPLOAD_RESULT from UploadMonitor for
                    // handling manual cancellation.
                }
            },
           /* onFileUploadResult: function alvex_forms_controls__FileUploader_onFileUploadResult(payload) {
                if ((payload.isUploaded) &&(payload.response.nodeRef != null)) {


                    var oldValue;
                    var updatedValue;
                    if (this.multipleItemMode) {
                        !!!this.itemsToShow && (this.itemsToShow = []);
                        this.itemsToShow.push({
                            type: payload.file.type,
                            nodeRef: payload.response.nodeRef,
                            name: payload.file.name
                        });
                        // Syncing value with displayed
                        !!!this.value && (this.value = []);
                        oldValue = this.value;
                        updatedValue = [];
                        array.forEach(this.itemsToShow, function (file) {
                            updatedValue.push(file.nodeRef);
                        }, this);
                        this.value = updatedValue;
                        this.onValueChangeEvent(this.name, oldValue, updatedValue);

                        this.updateSelectedItems(this.updateSelectedItemsTopic);
                    } else {
                        this.itemsToShow = [{
                            type: payload.file.type,
                            nodeRef: payload.response.nodeRef,
                            name: payload.file.name
                        }];

                        !!!this.value && (this.value = []);
                        oldValue = this.value;
                        updatedValue = [payload.response.nodeRef];
                        this.value = updatedValue;
                    }
                    this.onValueChangeEvent(this.name, oldValue, updatedValue);
                    this.updateSelectedItems(this.updateSelectedItemsTopic);
                } else
                {
                    // Handle upload failure by removing the lock from the form.
                    // It's possible that we need to throw one more GOST_UPLOAD_RESULT from UploadMonitor for
                    // handling manual cancellation.
                }
            },*/
            onItemRemoved: function alvex_forms_controls__FileUploader_onItemRemoved (payload) {
                var keyToRemove = lang.getObject("nodeRef", false, payload);
                this.itemsToShow = array.filter(this.itemsToShow, function(file) {
                    var existingKey = lang.getObject("nodeRef", false, file);
                    return keyToRemove !== existingKey;
                }, this);

                var oldValue = this.value;
                var updatedValue = [];
                array.forEach(this.itemsToShow, function (file) {
                    updatedValue.push(file.nodeRef);
                }, this);

                this.value = updatedValue;
                this.onValueChangeEvent(this.name, oldValue, updatedValue);
                this.updateSelectedItems(this.updateSelectedItemsTopic);
            },
            createFormControl: function alvex_forms_controls__FileUploader_createFormControl (config, domNode) {
                this.setupSubTopics();
                this._dialogId = this.id + "_FILE_PICKER_DIALOG";
                var widgetsForControl = [
                    {
                        id: this.id + "_ITEMS",
                        name: "alfresco/layout/DynamicWidgets",
                        config: {
                            subscriptionTopic: this.updateSelectedItemsTopic,
                            subscribeGlobal: true
                        }
                    },
                    {
                        id: this.id + "_UPLOAD_BUTTON",
                        name: "alfresco/buttons/AlfButton",
                        config: {
                            label: "uploader.button.upload",
                            publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
                            publishPayload: {
                                dialogId: this._dialogId,
                                dialogTitle: "uploader.dialog.upload.title",
                                formSubmissionTopic: "ALF_UPLOAD_REQUEST",
                                formSubmissionPayloadMixin: {
                                    targetData: {
                                        destination: "alfresco://user/home",
                                        siteId: null,
                                        containerId: null
                                    },
                                    alvexUploadResponseTopic: this.alvexUploadResponseTopic
                                },
                                widgets: [
                                    /*{
                                        name: "alfresco/forms/controls/ContainerPicker",
                                        config: {
                                            name: "targetData.destination",
                                            label: "Upload location"
                                        }
                                    },*/
                                    {
                                        name: "alfresco/forms/controls/FileSelect",
                                        config: {
                                            filterMimeType: this.filterMimeType,
                                            name: "files",
                                            label: "uploader.dialog.select",
                                            multiple: this.multipleItemMode
                                        }
                                    }
                                ]
                            },
                            publishGlobal: true
                        }
                    }
                ];
                return this.processWidgets(widgetsForControl, this._controlNode);
            },
            getValue: function alvex_forms_controls__FileUploader_getValue() {
                var value = this.value;
                if (value && ObjectTypeUtils.isArray(value)) {
                    value = value.join(this.valueDelimiter);
                } else if ((!value)||(value == [])) {
                    // we're working with arrays inside widget and giving out string
                    value = "";
                }
                return value;
            },
            setValue: function alvex_forms_controls__FileUploader_setValue(value) {
                if ((ObjectTypeUtils.isString(value))&&(value !== "")) {
                    value = value.split(this.valueDelimiter);
                }
                if (value && ObjectTypeUtils.isArray(value)) {
                    if (!this.multipleItemMode && value.length > 1) {
                        this.alfLog("warn", "More than one element in value array set for single-selection FilePicker - only using first element", value, this);
                        value = [value[0]];
                    }
                    var valueCount = value.length;
                    var tmpValue, tmpItemsToShow = [];
                    tmpValue = this.multipleItemMode ? [] : null;
                    // NOTE: value - string with nodeRefs divided by this.valueDelimiter
                    array.forEach(value, function(currentRef) {
                        if (currentRef) {
                            var responseTopic = this.generateUuid()+"_FileUpl_";
                            var handle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, function(payload) {
                                this.alfUnsubscribe(handle);
                                var updatedFile = payload.response.item;
                                this.normaliseFile(updatedFile);
                                var nodeRef = lang.getObject("nodeRef", false, updatedFile);
                                if (this.multipleItemMode) {
                                    tmpValue.push(nodeRef);
                                }
                                else {
                                    tmpValue = nodeRef;
                                }
                                tmpItemsToShow.push(updatedFile);
                                valueCount--;
                                if (valueCount === 0) {
                                    this.itemsToShow = tmpItemsToShow;
                                    this.value = tmpValue;
                                    this.updateSelectedItems(this.updateSelectedItemsTopic);
                                    this.onValueChangeEvent(this.name, null, tmpValue);
                                }
                            }), true);
                            this.alfServicePublish(topics.GET_DOCUMENT, {
                                alfResponseTopic: responseTopic,
                                nodeRef: currentRef
                            });
                        }
                    }, this);
                }
                //TODO get the metadata for files from value
                this.value = value;
            },

            updateSelectedItems: function alvex_forms_controls__FileUploader__updateSelectedItems(topic) {
                var widgetsForSelectedItems = lang.clone(this.widgetsForSelectedItems);
                this.processObject(["processInstanceTokens"], widgetsForSelectedItems);
                this.alfPublish(topic, {
                    widgets: widgetsForSelectedItems
                }, true);
            },

            normaliseFile: function alfresco_forms_controls_FilePicker__normaliseFile(file) {
                !!!file.name && (file.name = lang.getObject("node.properties.cm:name", false, file) || "");
                !!!file.title && (file.title = lang.getObject("node.properties.cm:title", false, file) || "");
                !!!file.description && (file.description = lang.getObject("node.properties.cm:description", false, file) || "");
                !!!file.nodeRef && (file.nodeRef = lang.getObject("node.nodeRef", false, file) || "");
                !!!file.modifiedOn && (file.modifiedOn = lang.getObject("node.properties.cm:modified.iso8601", false, file) || "");
                !!!file.modifiedBy && (file.modifiedBy = lang.getObject("node.properties.cm:modifier.displayName", false, file) || "");
                !!!file.site && (file.site = lang.getObject("location.site", false, file) || {});
                !!!file.site.shortName && (file.site.shortName = lang.getObject("location.site.name", false, file) || "");
                !!!file.path && (file.path = lang.getObject("location.path", false, file) || "");
            },

            getWidgetConfig: function alfresco_forms_controls_FilePicker__getWidgetConfig() {
                if (this.requirementConfig && this.requirementConfig.initialValue == true) {
                    if (!this.validationConfig || !ObjectTypeUtils.isArray(this.validationConfig)) {
                        this.validationConfig = [];
                    }
                    this.validationConfig.push({
                        validation: "minLength",
                        length: 1,
                        errorMessage: "uploader.error.mandatory"
                    });
                }
                return {};
            },

            widgetsForSelectedItems: [
                {
                    id: "{id}_ITEMS_VIEW",
                    name: "alfresco/lists/views/AlfListView",
                    config: {
                        noItemsMessage: " ",
                        currentData: {
                            items: "{itemsToShow}"
                        },
                        widgets: [
                           /* {
                                name: "alfresco/lists/views/layouts/Row",
                                config: {
                                    widgets: [
                                        {
                                            name: "alfresco/lists/views/layouts/Cell",
                                            config: {
                                                width: "22px",
                                                widgets: [
                                                    {
                                                        id: "{id}_SELECTED_FILES_THUMBNAIL",
                                                        name: "alfresco/search/SearchThumbnail",
                                                        config: {
                                                            width: "22px",
                                                            showDocumentPreview: true
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            name: "alfresco/lists/views/layouts/Cell",
                                            config: {
                                                widgets: [
                                                    {
                                                        id: "{id}_SELECTED_FILES_NAME",
                                                        name: "alfresco/renderers/Property",
                                                        config: {
                                                            propertyToRender: "name"
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            name: "alfresco/lists/views/layouts/Cell",
                                            config: {
                                                width: "20px",
                                                widgets: [
                                                    {
                                                        id: "{id}_ITEMS_REMOVE",
                                                        name: "alfresco/renderers/PublishAction",
                                                        config: {
                                                            iconClass: "delete-16",
                                                            publishTopic: "{removeItemTopic}",
                                                            publishPayloadType: "CURRENT_ITEM",
                                                            publishGlobal: true
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }*/
                            {
                                name: "alfresco/lists/views/layouts/Row",
                                config: {
                                    widgets: [
                                        {
                                            name: "alfresco/lists/views/layouts/Cell",
                                            config: {
                                                width: "40px",
                                                widgets: [
                                                    {
                                                        id: "{id}_SELECTED_FILES_THUMBNAIL",
                                                        name: "alfresco/search/SearchThumbnail",
                                                        config: {
                                                            width: "32px",
                                                            showDocumentPreview: true
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            name: "alfresco/lists/views/layouts/Cell",
                                            config: {
                                                widgets: [
                                                    {
                                                        id: "{id}_SELECTED_FILES_NAME",
                                                        name: "alfresco/renderers/Property",
                                                        config: {
                                                            propertyToRender: "displayName",
                                                            renderSize: "large"
                                                        }
                                                    },
                                                    {
                                                        id: "{id}_SELECTED_FILES_TITLE",
                                                        name: "alfresco/renderers/Property",
                                                        config: {
                                                            propertyToRender: "title",
                                                            renderSize: "small",
                                                            renderedValuePrefix: "(",
                                                            renderedValueSuffix: ")"
                                                        }
                                                    },
                                                    {
                                                        id: "{id}_SELECTED_FILES_DATE",
                                                        name: "alfresco/renderers/Date",
                                                        config: {
                                                            renderSize: "small",
                                                            deemphasized: true,
                                                            renderOnNewLine: true,
                                                            modifiedDateProperty: "modifiedOn",
                                                            modifiedByProperty: "modifiedBy"
                                                        }
                                                    },
                                                    {
                                                        id: "{id}_SELECTED_FILES_DESCRIPTION",
                                                        name: "alfresco/renderers/Property",
                                                        config: {
                                                            propertyToRender: "description",
                                                            renderSize: "small",
                                                            renderOnNewLine: true
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            name: "alfresco/lists/views/layouts/Cell",
                                            config: {
                                                width: "20px",
                                                widgets: [
                                                    {
                                                        id: "{id}_SELECTED_FILES_REMOVE",
                                                        name: "alfresco/renderers/PublishAction",
                                                        config: {
                                                            iconClass: "delete-16",
                                                            publishTopic: "{removeFileTopic}",
                                                            publishPayloadType: "CURRENT_ITEM",
                                                            publishGlobal: true
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        })
    });
