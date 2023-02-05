import libVal from '../Common/Library/ValidationLibrary';
import libCommon from '../Common/Library/CommonLibrary';

export default function SignatureControlParentBinding(context) {

    let previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    let previousPageClientData = previousPage.getClientData();
    let parent = libVal.evalIsEmpty(previousPageClientData.currentObject) ? previousPage.binding : previousPageClientData.currentObject;

    ///Get context menu binding 
    if (libCommon.getStateVariable(context, 'ContextMenuBindingObject')) {
        parent = libCommon.getStateVariable(context, 'ContextMenuBindingObject');
    }

    if (libVal.evalIsEmpty(parent) && !libVal.evalIsEmpty(previousPageClientData.confirmationArgs)) {
        parent = previousPageClientData.confirmationArgs;
    }

    if (libCommon.getWorkOrderAssnTypeLevel(context) === 'Operation') {
        if (!libVal.evalIsEmpty(parent) && !libVal.evalIsEmpty(parent.OperationObject)) {
            parent = parent.OperationObject;
        }
    }

    if (libVal.evalIsEmpty(parent['@odata.type']) && !libVal.evalIsEmpty(parent.WorkOrderHeader)) {
        parent = parent.WorkOrderHeader;
    }

    return parent;
}
