import libCommon from '../../Common/Library/CommonLibrary';

export default function EquipmentCreateNewEquipGeometry(context) {
    libCommon.setStateVariable(context, 'CreateNewGeometry', JSON.parse(context.evaluateTargetPath('#ActionResults:CreateNewGeometry').data));
    return context.executeAction('/SAPAssetManager/Actions/Equipment/CreateUpdate/EquipmentCreateNewEquipGeometry.action').then(function() {
        return context.executeAction({'Name': '/SAPAssetManager/Actions/Equipment/CreateUpdate/EquipmentUpdateGeometry.action', 'Properties': {
            'Target': {
                'EntitySet': 'MyEquipments',
                'Service' : '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink' : '/SAPAssetManager/Rules/Equipment/CreateUpdate/EquipmentReadLink.js',
            },
        }}).then(function() {
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action');
        });
    });
}
