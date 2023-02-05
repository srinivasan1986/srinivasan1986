import DocumentCreateDelete from '../../Documents/Create/DocumentCreateDelete';
import { PartnerFunction } from '../../Common/Library/PartnerFunction';
import libCommon from '../../Common/Library/CommonLibrary';
import WorkOrderCreateUpdateGeometryPost from './WorkOrderCreateUpdateGeometryPost';

export default function WorkOrderUpdateOnSuccess(context) {
    if (context.binding.isServiceOrder) {
        let partnerFuncForSoldToParty = PartnerFunction.getSoldToPartyPartnerFunction();
        let currentSoldToPartyPartner = context.binding.WOPartners.find((partner) => {
            return partner.PartnerFunction === partnerFuncForSoldToParty;
        });
        let newPartnerID = context.evaluateTargetPath('#Control:SoldToPartyLstPkr/#SelectedValue');
        //Update the service order with select sold-to-party
        return updateSOPartner(context, currentSoldToPartyPartner['@odata.readLink'], currentSoldToPartyPartner.Partner, newPartnerID).then(() => {
            return updateAccountingIndicator(context).then(() => {
                return DocumentCreateDelete(context);
            });
        });
    }
    if (libCommon.getStateVariable(context, 'GeometryObjectType') === 'WorkOrder') {
        libCommon.setStateVariable(context, 'GeometryObjectType', '');
        return WorkOrderCreateUpdateGeometryPost(context).then(() => {
            return DocumentCreateDelete(context);
        });
    } else {
        return DocumentCreateDelete(context);
    }
}

function updateSOPartner(context, currentPartnerReadLink, currentPartnerID, newPartnerID) {
    if (newPartnerID === currentPartnerID) {
        return Promise.resolve();
    }
    context.binding.currentPartnerID = currentPartnerID;
    context.binding.soldToPartyPartnerReadLink = currentPartnerReadLink;
    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrderPartnerUpdate.action');
}

function updateAccountingIndicator(context) {
    const accountingIndicator = libCommon.getTargetPathValue(context,'#Page:WorkOrderCreateUpdatePage/#Control:AccountIndicatorLstPkr/#SelectedValue');        
    context.binding.AccountingIndicator = accountingIndicator;
    if (libCommon.isDefined(context.binding.WOSales_Nav)) {
        context.binding.WOSales_Nav.AccountingIndicator = accountingIndicator;
    }
    return Promise.resolve();
}
