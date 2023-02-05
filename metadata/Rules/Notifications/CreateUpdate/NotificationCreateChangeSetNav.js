import libCommon from '../../Common/Library/CommonLibrary';
import NotificationTypePkrDefaultOnCreate from '../NotificationTypePkrDefaultOnCreate';
import lamCopy from './NotificationCreateLAMCopy';

export default function NotificationCreateChangeSetNav(context, bindingParams) {
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');

    let contextBinding = libCommon.setBindingObject(context);

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotificationTypes', [], "$select=PriorityType&$filter=NotifType eq '" + libCommon.getAppParam(context, 'NOTIFICATION', 'NotificationType') + "'").then(function(data) {
        return NotificationTypePkrDefaultOnCreate(context).then(notifTypeDefault => {
            let binding = {'NotifPriority': {}};
            if (data.length > 0) // Ensure notification create doesn't bomb out if no default is set
                binding.PriorityType = data.getItem(0).PriorityType;
            if (bindingParams) {
                Object.assign(binding, bindingParams);
            }
            if (notifTypeDefault) {
                binding.NotificationType = notifTypeDefault;
            }
            if (contextBinding && contextBinding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
                binding.HeaderFunctionLocation = contextBinding.FuncLocId;
            } else if (contextBinding && contextBinding['@odata.type'] === '#sap_mobile.MyEquipment') {
                binding.HeaderEquipment = contextBinding.EquipId;
                binding.HeaderFunctionLocation = contextBinding.FuncLocId;
            }
            if (context.setActionBinding)
                context.setActionBinding(binding);
            else
                context.getPageProxy().setActionBinding(binding);
            libCommon.setStateVariable(context, 'LocalId', ''); //Reset before starting create
            libCommon.setStateVariable(context, 'lastLocalItemNumber', '');
            libCommon.setStateVariable(context,'NotifType', notifTypeDefault);
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'NotifPartnerDetProcs', [], `$orderby=PartnerFunction&$expand=PartnerFunction_Nav&$top=2&$filter=NotifType eq '${notifTypeDefault}' and PartnerIsMandatory eq 'X' and sap.entityexists(PartnerFunction_Nav)`).then(result => {
                if (result.length > 0) {
                    if (result.length > 1) {
                        libCommon.setStateVariable(context,'partnerType1', result.getItem(0).PartnerFunction_Nav.PartnerFunction);
                         libCommon.setStateVariable(context,'partnerType2', result.getItem(1).PartnerFunction_Nav.PartnerFunction);
                    }
                    libCommon.setStateVariable(context,'partnerType1', result.getItem(0).PartnerFunction_Nav.PartnerFunction);
                    libCommon.setStateVariable(context,'partnerType2', '');
                } else {
                    libCommon.setStateVariable(context,'partnerType1', '');
                    libCommon.setStateVariable(context,'partnerType2', '');
                }
            }).finally(() => {
                return context.executeAction('/SAPAssetManager/Actions/Notifications/ChangeSet/NotificationCreateChangeset.action').then(() => {
                    return lamCopy(context);
                }); 
            });
        });
    });
}
