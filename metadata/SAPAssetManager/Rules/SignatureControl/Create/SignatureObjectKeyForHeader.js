import libCommon from '../../Common/Library/CommonLibrary';
import getParentBinding from '../SignatureControlParentBinding';
export default function SignatureObjectKeyForHeader(controlProxy) {
    let object = getParentBinding(controlProxy);
    let value = object['@odata.readLink'];

    switch (object['@odata.type']) {
        case '#sap_mobile.MyWorkOrderHeader': {
            value += ':OrderId';
            break;
        }
        case '#sap_mobile.MyWorkOrderOperation': {
            if (object.OperationNo[0] === 'L') {
                value += ':OperationNo';
                break;
            } else {
                return object.ObjectKey;
            }
        }
        case '#sap_mobile.MyWorkOrderSubOperation': {
            if (object.SubOperationNo[0] === 'L') {
                value += ':SubOperationNo';
                break;
            } else {
                return object.ObjectKey;
            }
        }
        case '#sap_mobile.ConfirmationOverviewRow': {
            if (libCommon.getStateVariable(controlProxy, 'FinalConfirmationIsCompletingWorkOrder')) {
                value = controlProxy.evaluateTargetPathForAPI('#Page:-Previous').getClientData().confirmationArgs.WorkOrderHeader['@odata.readLink'] + ':OrderId';
            } else {
                value = `MyWorkOrderOperations(OrderId='${controlProxy.evaluateTargetPathForAPI('#Page:-Previous').getClientData().confirmationArgs.OrderID}',OperationNo='${controlProxy.evaluateTargetPathForAPI('#Page:-Previous').getClientData().confirmationArgs.Operation}'):OperationNo`;       
            }
            break;
        }
        case '#sap_mobile.Confirmation': {
            if (libCommon.getStateVariable(controlProxy, 'FinalConfirmationIsCompletingWorkOrder')) {
                value = object.WorkOrderHeader['@odata.readLink'] + ':OrderId'; 
            } else {
                value = object.WorkOrderOperation['@odata.readLink'] + ':OperationNo';     
            }
            break;
        }
        default:
            break;
    }
    return '<' + value + '>';
}
