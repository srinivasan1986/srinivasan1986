export default function Reservation201ItemDetailsVisible(context) {
    let move = context.binding.MovementType || context.binding.MoveType;
    return context.getPageProxy().binding['@odata.type'].includes('ReservationItem') && move === '201';
}
