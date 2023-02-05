export default function Reservation261ItemDetailsVisible(context) {
    let move = context.binding.MovementType || context.binding.MoveType;
    return context.getPageProxy().binding['@odata.type'].includes('ReservationItem') && move === '261';
}
