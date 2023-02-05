import libCommon from '../../Common/Library/CommonLibrary';

export default function WorkOrderCreateWOGeometry(context) {
    libCommon.setStateVariable(context, 'CreateGeometry', JSON.parse(context.evaluateTargetPath('#ActionResults:CreateGeometry').data));
    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreateWOGeometry.action').then(function() {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderUpdateGeometry.action').then(function() {
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action');
        });
    });
}
