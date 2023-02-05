/**
* Check if Crew Component is enabled and execute the appropriate rule accordingly
* @param {IClientAPI} context
*/
import timeSheetUpdateCrew from '../Crew/TimeSheets/TimeSheetUpdateCrew';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
export default function TimeSheetEntrySuccessMessage(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        timeSheetUpdateCrew(context);
    } else {
        return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntrySuccessMessage.action');
    }
}
