import libCom from '../../Common/Library/CommonLibrary';
import ShowSerialNumberField from '../Validation/ShowSerialNumberField';

export default function GetConfirmedQuantity(context) {

    let binding = context.binding;
    let decimals = Number(context.getGlobalDefinition('/SAPAssetManager/Globals/Inventory/QuantityFieldDecimalPlacesAllowed.global').getValue());

    if (binding) {
        let type = binding['@odata.type'].substring('#sap_mobile.'.length);
        let move = libCom.getStateVariable(context, 'IMMovementType');
        let oldQuantity = 0;

        if (type.includes('DeliveryItem')) {
            return ShowSerialNumberField(context).then(show => {
                if (show) {
                    return binding.PickedQuantity;
                }

                return binding.Quantity;
            });
        }

        if (type === 'MaterialDocItem') { //Redirect binding to point to the underlying inventory object
            if (context.binding.PurchaseOrderItem_Nav) {
                binding = context.binding.PurchaseOrderItem_Nav;
                type = 'PurchaseOrderItem';
            } else if (context.binding.StockTransportOrderItem_Nav) {
                binding = context.binding.StockTransportOrderItem_Nav;
                type = 'StockTransportOrderItem';
            } else if (context.binding.ReservationItem_Nav) {
                binding = context.binding.ReservationItem_Nav;
                type = 'ReservationItem';
            } else {
                return context.formatNumber(Number(binding.EntryQuantity), '', {maximumFractionDigits: decimals}) + ' ' + binding.EntryUOM;
            }
        } 
        
        if (type === 'PurchaseOrderItem') {
            return context.formatNumber(Number(binding.ReceivedQuantity) - oldQuantity, '', {maximumFractionDigits: decimals}) + ' ' + binding.OrderUOM;
        } else if (type === 'StockTransportOrderItem') {
            if (move === 'R') { //Receipt
                return context.formatNumber(Number(binding.ReceivedQuantity) - oldQuantity, '', {maximumFractionDigits: decimals}) + ' ' + binding.OrderUOM;
            }
            return context.formatNumber(Number(binding.IssuedQuantity) - oldQuantity, '', {maximumFractionDigits: decimals}) + ' ' + binding.OrderUOM; //Issue
        } else if (type === 'ReservationItem') {
            return context.formatNumber(Number(binding.WithdrawalQuantity) - oldQuantity, '', {maximumFractionDigits: decimals}) + ' ' + binding.RequirementUOM;
        }
    }
    return '0';
}
