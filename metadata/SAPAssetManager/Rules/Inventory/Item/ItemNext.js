import ItemPreviousNextEnabled from './ItemPreviousNextEnabled';
import ItemsData from './ItemsData';

export default function ItemNext(context) {
    const compareItem = context.getPageProxy().getClientData().item || context.binding;
    const type = compareItem['@odata.type'].substring('#sap_mobile.'.length);

    return ItemsData(context).then(items => {
        for (let i = 0; i < items.length; i++) {
            if (items[i]['@odata.id'] === compareItem['@odata.id']) {
                const nextItem = items[i + 1];
                context.getPageProxy().getClientData().item = nextItem;
                let text = 'item_item_number';
                let itemNum = nextItem.ItemNum;
    
                if (type === 'InboundDeliveryItem' || type === 'OutboundDeliveryItem' || type === 'PhysicalInventoryDocItem') {
                    itemNum = nextItem.Item;
                } else if (type === 'MaterialDocItem') {
                    text = 'material_document_item_number';
                    itemNum = nextItem.MatDocItem;
                    context.getPageProxy().setActionBarItemVisible(0, nextItem['@sap.isLocal']);
                }
                
                context.getPageProxy().setCaption(context.localizeText(text, [itemNum]));
                ItemPreviousNextEnabled(context, nextItem, items);
            }
        }

        context.getPageProxy().getControl('SectionedTable').redraw();
    });
}
