/**
* Show/hide characteristic edit button based on User Authorization
* @param {IClientAPI} context
*/
import enableEquipEdit from '../../UserAuthorizations/Equipments/EnableEquipmentEdit';
import enableFlocEdit from '../../UserAuthorizations/FunctionalLocations/EnableFunctionalLocationEdit';
export default function EnableCharEdit(context) {
    let entityType = context.evaluateTargetPathForAPI('#Page:-Previous').binding['@odata.type'];
    switch (entityType) {
        case '#sap_mobile.MyEquipment':
            return enableEquipEdit(context) ? 'detailButton' : '';
        case '#sap_mobile.MyFunctionalLocation':
            return enableFlocEdit(context) ? 'detailButton' : '' ;
        default: 
            return 'detailButton';
    }
}
