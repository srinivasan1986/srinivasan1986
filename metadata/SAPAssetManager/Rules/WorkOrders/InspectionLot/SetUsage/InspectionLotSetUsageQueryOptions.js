import libCom from '../../../Common/Library/CommonLibrary';

export default function InspectionLotSetUsageQueryOptions(context) {
    let udSelectedSet = '';
    let catalogType = libCom.getAppParam(context, 'CATALOGTYPE', 'UsageDecision');
    let orderType = '';
    let planningPlant = '';

    if (context.binding['@odata.type'] === '#sap_mobile.InspectionPoint') {
        orderType = context.binding.WOOperation_Nav.WOHeader.OrderType;
        planningPlant = context.binding.WOOperation_Nav.WOHeader.PlanningPlant;
    } else {
        orderType = context.binding.WOHeader_Nav.OrderType;
        planningPlant = context.binding.WOHeader_Nav.PlanningPlant;
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', ['UDSelectedSet'], `$filter=OrderType eq '${orderType}' and PlanningPlant eq '${planningPlant}'`).then((orderTypeRecord) => {
        if (orderTypeRecord.length > 0) {
            udSelectedSet = orderTypeRecord.getItem(0).UDSelectedSet;
        }

        return `$filter=(SelectedSet eq '${udSelectedSet}' and Plant eq '${planningPlant}' and Catalog eq '${catalogType}')&$expand=InspValuation_Nav`;
    });
} 
