import libCom from '../Common/Library/CommonLibrary';

export default function DocumentDateEditable(context) {
    let objectType = libCom.getStateVariable(context, 'IMObjectType');
    if (objectType === 'ADHOC') {
        return false;
    }
    return true;
}
