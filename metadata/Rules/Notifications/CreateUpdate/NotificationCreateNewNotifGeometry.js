import libCommon from '../../Common/Library/CommonLibrary';

export default function NotificationCreateNewNotifGeometry(context) {
    libCommon.setStateVariable(context, 'CreateNewGeometry', JSON.parse(context.evaluateTargetPath('#ActionResults:CreateNewGeometry').data));
    return context.executeAction('/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationCreateNewNotifGeometry.action').then(function() {
        return context.executeAction({'Name': '/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationUpdateGeometry.action', 'Properties': {
            'Target': {
                'EntitySet': 'MyNotificationHeaders',
                'Service' : '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink' : '/SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationReadLink.js',
            },
        }}).then(function() {
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action');
        });
    });
}
