import libCommon from '../Common/Library/CommonLibrary';
import libWOStatus from './MobileStatus/WorkOrderMobileStatusLibrary';

export default function WorkOrderUpdateNav(context) {
    let queryOption = '$select=*,Equipment/EquipId,FunctionalLocation/FuncLocIdIntern&$expand=MarkedJob,Equipment,FunctionalLocation,WODocuments,OrderMobileStatus_Nav';
    let binding = libCommon.setBindingObject(context);
    if (binding.isServiceOrder) {
        queryOption += ',WOSales_Nav,WOPartners'; //expand on WOSales_Nav & WOPartners for service orders. It'll be used to populate sold-to-party field on edit screen.
    }
    let isLocal = !!binding['@sap.isLocal'];
    libCommon.setOnCreateUpdateFlag(context, 'UPDATE');
    libCommon.removeStateVariable(context, 'WODefaultPlanningPlant');
    libCommon.removeStateVariable(context, 'WODefaultWorkCenterPlant');
    libCommon.removeStateVariable(context, 'WODefaultMainWorkCenter');
    if (!isLocal) {
        return libWOStatus.isOrderComplete(context).then(status => {
            if (!status) {
                //Set the global TransactionType variable to CREATE
                return libCommon.navigateOnRead(context, '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreateUpdateNav.action', binding['@odata.readLink'] , queryOption);
            }
            return '';
        });
    }
    return libCommon.navigateOnRead(context, '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreateUpdateNav.action', binding['@odata.readLink'] , queryOption);
}
