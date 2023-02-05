import libCom from '../../Common/Library/CommonLibrary';

export default function ShowConfirmedQuantity(context) {
    const type = libCom.getStateVariable(context, 'IMObjectType');
  
    if (type === 'PO' || type === 'STO' || type === 'RES' || type === 'IB' || type === 'OB') {
        return true;
    } 
    
    return false;
}
