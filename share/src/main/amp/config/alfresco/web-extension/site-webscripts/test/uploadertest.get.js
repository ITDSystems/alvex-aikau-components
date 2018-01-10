model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      },
      "alvex/services/FileUploadService",
      "alfresco/services/ContentService",
      "alfresco/services/DialogService",
      "alfresco/services/DocumentService",
      "alfresco/services/SiteService",
      "alfresco/services/NotificationService",
      "alfresco/services/LightboxService"
   ],
   widgets: [
      {
         name: "alfresco/layout/HorizontalWidgets",
         config: {
            widgetMarginLeft: 10,
            widgetMarginRight: 10,
            widgets: [
               {
                  name: "alfresco/forms/Form",
                  config: {

                     okButtonPublishTopic: "_PICKED_DATA",
                     widgets: [
                        {
                           name: "alvex/forms/controls/FileUploader",
                           config: {
                              label: "test",
                              name: "pew"
                           }
                        }
                     ]
                  }
               }

            ]
         }
      }
   ]
};
