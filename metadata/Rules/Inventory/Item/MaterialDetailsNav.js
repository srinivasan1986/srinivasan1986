import libCom from '../../Common/Library/CommonLibrary';
import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';

export default function MaterialDetailsNav(context) {
    let item = context.getPageProxy().getClientData().item || context.binding;
    let MatDocItemQuery = '';
    if (item) {
        MatDocItemQuery =  ` and MatDocItem eq '${item.MatDocItem}'`;
    } else {
        item = context.getPageProxy().getActionBinding();
        MatDocItemQuery = '';
        libCom.removeStateVariable(context, 'ClosePageCount');
    }

    if (EnableFieldServiceTechnician(context) && libCom.getPreviousPageName(context) === 'StockListViewPage') {
        libCom.setStateVariable(context, 'Temp_MaterialDocumentReadLink', item['@odata.readLink']);
        libCom.setStateVariable(context, 'Temp_MaterialDocumentNumber', item.MaterialDocNumber);
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', [], `$filter=MaterialDocNumber eq '${item.MaterialDocNumber}'${MatDocItemQuery}&$expand=AssociatedMaterialDoc`).then(data => {
        context.getPageProxy().setActionBinding(data.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/Inventory/MaterialDocument/MaterialDocumentDetailsNav.action');
    });
}
