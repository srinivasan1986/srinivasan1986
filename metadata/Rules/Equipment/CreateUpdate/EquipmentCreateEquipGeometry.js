import libCommon from '../../Common/Library/CommonLibrary';

export default function EquipmentCreateEquipGeometry(context) {
    libCommon.setStateVariable(context, 'CreateGeometry', JSON.parse(context.evaluateTargetPath('#ActionResults:CreateGeometry').data));
    return context.executeAction('/SAPAssetManager/Actions/Equipment/CreateUpdate/EquipmentCreateEquipGeometry.action').then(function() {
        return context.executeAction('/SAPAssetManager/Actions/Equipment/CreateUpdate/EquipmentUpdateGeometry.action').then(function() {
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action');
        });
    });
}
