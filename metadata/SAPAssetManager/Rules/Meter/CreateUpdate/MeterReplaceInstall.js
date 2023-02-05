import libMeter from '../../Meter/Common/MeterLibrary';
import meterDetailsOnReturn from '../../WorkOrders/Meter/MeterDetailsOnReturn';
import libCommon from '../../Common/Library/CommonLibrary';

export default function MeterReplaceInstall(context) {
    let meterTransactionType = libMeter.getMeterTransactionType(context);
    if (meterTransactionType === 'REPLACE') {
        let batchEquipmentNum = context.binding.BatchEquipmentNum;
        let OrderISULink = context.binding.OrderISULink;
        if (OrderISULink) {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(function() {
                return context.read('/SAPAssetManager/Services/AssetManager.service', OrderISULink['@odata.readLink'], [],'$expand=Device_Nav/RegisterGroup_Nav,Device_Nav/DeviceCategory_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,Workorder_Nav').then(function(readOrder) {
                    if (readOrder.getItem(0)) {
                        return context.executeAction('/SAPAssetManager/Actions/Meters/ReplaceDialog.action').then(function(result) {
                            if (result.data === true) {
                                let order = readOrder.getItem(0);
                                order.BatchEquipmentNum = batchEquipmentNum;
                                order.OrderISULink = OrderISULink;
                                context.setActionBinding(order);
                                libMeter.setMeterTransactionType(context, 'REP_INST');
                                return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterCreateUpdateNav.action');
                            } else {
                                return meterDetailsOnReturn(context);
                            }
                        });
                    }
                    return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterReadingsCreateUpdateChangeSetSuccess.action').then( ()=> {
                        libCommon.setStateVariable(context, 'METERREADINGOBJ', '');
                    });
                });
            });
        }
    }
    return meterDetailsOnReturn(context).then(function() {
        return context.executeAction('/SAPAssetManager/Actions/Meters/CreateUpdate/MeterReadingsCreateUpdateChangeSetSuccess.action').then( ()=> {
            libCommon.setStateVariable(context, 'METERREADINGOBJ', '');
        });
    });
}
