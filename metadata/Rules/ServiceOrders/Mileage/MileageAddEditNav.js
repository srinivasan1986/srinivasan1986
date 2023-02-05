import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MileageAddEditNav(context) {
    if (CommonLibrary.getStateVariable(context, 'IsWOCompletion')) {
        let binding = CommonLibrary.getStateVariable(context, 'WOBinding');
        context.setActionBinding(binding);
    }
    
    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/Mileage/MileageAddEditNav.action');
}
