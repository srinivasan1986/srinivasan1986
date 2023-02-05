import itemsContextStateVariablesSet from './ItemsContextStateVariablesSet';
import libCom from '../../Common/Library/CommonLibrary';
import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';

export default function OpenMaterialDocumentItemsScreen(context) {
    let binding = context.binding;
    if (!binding) {
        return false;
    }
    if (libCom.getPreviousPageName(context) === 'MaterialDocumentRecentList' && EnableFieldServiceTechnician(context)) {
        libCom.setOnCreateUpdateFlag(context, 'CREATE');
        libCom.setStateVariable(context, 'IMObjectType', 'ADHOC');
        libCom.setStateVariable(context, 'IMMovementType', 'I');
        return context.executeAction('/SAPAssetManager/Actions/Inventory/IssueOrReceipt/VehicleIssueOrReceiptCreateChangeset.action');
    }
    let type = '';
    switch (binding.MovementType) {
        case '501':
            type = 'R';
            break;
        case '301':
        case '311':
            type = 'T';
            break;
        case '201':
        case '221':
        case '261':
        case '281':
            type = 'I';
            break;
        default:
    }
    if (type) {
        libCom.setStateVariable(context, 'IMObjectType', 'ADHOC');
        libCom.setStateVariable(context, 'IMMovementType', type);
        context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().IsAlreadyCreatedDoc = true;
        context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().ActualDocId = binding.MaterialDocNumber;
        let fixedData = {
            headerNote: binding.AssociatedMaterialDoc.HeaderText,
            order: binding.OrderNumber,
            network: binding.Network,
            cost_center: binding.CostCenter,
            project: binding.WBSElement,
        };
        context.evaluateTargetPathForAPI('#Page:InventoryOverview').getClientData().FixedData = fixedData;
        let params = {
            MovementType: binding.MovementType,
            StorageLocation: binding.StorageLocation,
            Plant: binding.Plant,
            OrderNumber: binding.OrderNumber,
        };
        return itemsContextStateVariablesSet(context, binding.MaterialDocNumber, params).then(() => {
            context.getPageProxy().setActionBinding('');
            return context.getPageProxy().executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentModalListNav.action');
        });
    }
    return true;
}
