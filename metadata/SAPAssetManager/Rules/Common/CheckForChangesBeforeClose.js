import libCom from './Library/CommonLibrary';
import ClearFlagsAndClose from '../Crew/ClearFlagsAndClose';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function CheckForChangesBeforeClose(context) { 
    let confirmClosePageAction = '/SAPAssetManager/Actions/Page/ConfirmClosePage.action';
    let confirmCrewCancelAction = '/SAPAssetManager/Actions/Crew/ConfirmCancel.action';
    if (libCom.unsavedChangesPresent(context)) {
        let action = userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue()) ? confirmCrewCancelAction : confirmClosePageAction;
        return context.executeAction(action);
    } else if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        return ClearFlagsAndClose(context);
    } else {
        // proceed with cancel without asking
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    }
}
