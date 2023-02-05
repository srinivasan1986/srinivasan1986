import ItemPreviousNextEnabled from './ItemPreviousNextEnabled';
import ItemsData from './ItemsData';

export default function ItemNext(context) {
    const compareItem = context.getPageProxy().getClientData().item || context.binding;
    const type = compareItem['@odata.type'].substring('#sap_mobile.'.length);

    return ItemsData(context).then(items => {
        for (let i = 0; i < items.length; i++) {
            if (items[i]['@odata.id'] === compareItem['@odata.id']) {
                const previousItem = items[i - 1];
                context.getPageProxy().getClientData().item = previousItem;
                let text = 'item_item_number';
                let itemNum = previousItem.ItemNum;
    
                if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem' || type === 'PhysicalInventoryDocItem') {
                    itemNum = previousItem.Item;
                } else if (type === 'MaterialDocItem') {
                    text = 'material_document_item_number';
                    itemNum = previousItem.MatDocItem;
                    context.getPageProxy().setActionBarItemVisible(0, previousItem['@sap.isLocal']);
                }

                context.getPageProxy().setCaption(context.localizeText(text, [itemNum]));
                ItemPreviousNextEnabled(context, previousItem, items);
            }
        }

        context.getPageProxy().getControl('SectionedTable').redraw();
    });    
}
