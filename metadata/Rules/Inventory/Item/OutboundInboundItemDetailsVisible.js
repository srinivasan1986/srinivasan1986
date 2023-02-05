export default function OutboundInboundItemDetailsVisible(context) {
    return context.getPageProxy().binding['@odata.type'].includes('DeliveryItem');
}
