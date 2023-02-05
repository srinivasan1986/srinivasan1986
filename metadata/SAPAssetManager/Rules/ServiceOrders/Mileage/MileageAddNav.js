import CommonLibrary from '../../Common/Library/CommonLibrary';
import ConstantsLibrary from '../../Common/Library/ConstantsLibrary';

export default function MileageAddNav(context) {
    //set the CHANGSET flag to true
    CommonLibrary.setOnChangesetFlag(context, true);
    CommonLibrary.resetChangeSetActionCounter(context);
    CommonLibrary.setOnCreateUpdateFlag(context, ConstantsLibrary.createFlag);

    if (CommonLibrary.getStateVariable(context, 'IsWOCompletion')) {
        let binding = CommonLibrary.getStateVariable(context, 'WOBinding');
        context.setActionBinding(binding);
    }
    
    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/Mileage/MileageAddChangeSet.action');
}
