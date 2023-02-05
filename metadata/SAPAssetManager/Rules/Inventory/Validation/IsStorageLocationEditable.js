import libCom from '../../Common/Library/CommonLibrary';
import showMaterialNumberListPicker from './ShowMaterialNumberListPicker';

export default function IsStorageLocationEditable(context) {
    let editable = true;
    let movementType = libCom.getStateVariable(context, 'IMMovementType');
    let objectType = libCom.getStateVariable(context, 'IMObjectType');

    if ((movementType === 'R' || movementType === 'I') && (objectType === 'IB' || objectType === 'OB')) {
        editable = false;
    }
    if (!showMaterialNumberListPicker(context) && (objectType === 'IB' || objectType === 'OB' || objectType === 'MAT')) {
        editable = false;
    }

    return editable;
}
