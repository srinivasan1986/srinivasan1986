import libCom from '../../Common/Library/CommonLibrary';

export default function OpenQuantityCaption(context) {
    const objectType = libCom.getStateVariable(context, 'IMObjectType');

    if (objectType === 'PO' || objectType === 'STO' || objectType === 'RES') {
        return context.localizeText('open_quantity');
    } else if (objectType === 'ADHOC' || objectType === 'TRF') {
        return context.localizeText('po_item_detail_confirmed');
    }

    return context.localizeText('open_quantity');
}
