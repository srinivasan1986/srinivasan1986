import { TimeSheetLibrary as libTimesheet } from '../../TimeSheets/TimeSheetLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import ODataDate from '../../Common/Date/ODataDate';

export default function TimeSheetUpdateCrew(context) {

    let chosenDate = libCom.getFieldValue(context, 'DatePicker');
    let odataDate = new ODataDate(chosenDate).toLocalDateString();

    let query = `$expand=Employee&$filter=CrewList/OriginTimeStamp eq datetime'${odataDate}' and CrewItemType eq 'EMPLOYEE' and CrewItemKey eq '${context.binding.PersonnelNumber}'`;
    context.read('/SAPAssetManager/Services/AssetManager.service', 'CrewListItems', [], query).then(result => {
        if (result && result.length === 1) {
            context.getClientData().CrewListItemReadLink = result.getItem(0)['@odata.readLink'];

            //Subtract the original from CatsHours and add the new duration
            let existingDuration = result.getItem(0).CatsHours;
            let originalDuration = libTimesheet.getActualHours(context, libCom.getStateVariable(context, 'CrewTimeEntryOriginal'));
            let newDuration = libTimesheet.getActualHours(context, libCom.getFieldValue(context, 'DurationPkr'));

            context.getClientData().TotalCatsHours = (existingDuration - originalDuration) + newDuration;
            //update the corresponding CrewListItem
            return context.executeAction('/SAPAssetManager/Actions/Crew/CrewListItemEmployeeUpdate.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntrySuccessMessage.action');
            });
        } else {
            return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntrySuccessMessage.action');
        }
    });
}

