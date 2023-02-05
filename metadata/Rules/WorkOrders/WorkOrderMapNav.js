import GetGeometryInformation from '../Common/GetGeometryInformation';
import libEval from '../Common/Library/ValidationLibrary';
import libCom from '../Common/Library/CommonLibrary';
import personalLib from '../Persona/PersonaLibrary';

export default function WorkOrderMapNav(context) {

    let geometry = context.getBindingObject().geometry;

    if (geometry && Object.keys(geometry).length > 0) {
        // If this is a valid Work Order, navigate immediately
        if (personalLib.isFieldServiceTechnician(context)) {
            return context.executeAction('/SAPAssetManager/Actions/Extensions/FSMServiceOrderMapNav.action');
        }
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderMapNav.action');
    } else {
        let orderType = context.binding.OrderType;
        let queryOptions = `$filter=PMObjectType eq '${orderType}'&$orderby=SequenceNo asc`;

        return context.read('/SAPAssetManager/Services/AssetManager.service', 'AddressDetSequences', [], queryOptions).then(function(val) {
            libCom.setStateVariable(context, 'sequences', val);
            return GetGeometryInformation(context.getPageProxy(), 'WOPartners').then(function(value) {
                if (!libEval.evalIsEmpty(value)) {
                    context.getPageProxy().setActionBinding(value);

                    if (personalLib.isFieldServiceTechnician(context)) {
                        return context.executeAction('/SAPAssetManager/Actions/Extensions/FSMServiceOrderMapNav.action');
                    }

                    // update
                    if (libCom.getPageName(context) === 'WorkOrderCreateUpdatePage') {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderMapUpdateNav.action');
                    }
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderMapNav.action');
                }
                // create
                if (libCom.getPageName(context) === 'WorkOrderCreateUpdatePage') {
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderMapCreateNav.action');
                }
                return null;
            });
        });
    }
}
