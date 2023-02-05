import notification from '../../NotificationLibrary';
import common from '../../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../../UserFeatures/UserFeaturesLibrary';

export default function NotificationItemCreateUpdateDamage(context) {
    let binding = context.getPageProxy().binding;
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/QM.global').getValue()) && binding) {
        let codeGroup = context.getValue()[0].ReturnValue;
        var targetList = context.getPageProxy().evaluateTargetPathForAPI('#Control:DamageDetailsLstPkr');
        var specifier = targetList.getTargetSpecifier();

        let notifLookup = Promise.resolve(binding.NotificationType);

        if (context.binding.EAMChecklist_Nav) {
            return notification.NotificationItemCreateUpdateDamage(context);
        }

        if (binding['@odata.type'] !== '#sap_mobile.MyNotificationHeader' && binding['@odata.type']) {
            if (binding['@odata.type'] === '#sap_mobile.MyNotificationItem') {
                binding = binding.Notification;
                notifLookup = Promise.resolve(binding.NotificationType);
            } else if (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
                notifLookup = context.read('/SAPAssetManager/Services/AssetManager.service', `OrderTypes(PlanningPlant='${context.binding.InspectionLot_Nav.WOHeader_Nav.PlanningPlant}',OrderType='${context.binding.InspectionLot_Nav.WOHeader_Nav.OrderType}')`, [], '').then(result => {
                    return result.getItem(0).QMNotifType;
                });
            } else {
                binding = common.getStateVariable(context, 'CreateNotification');
                notifLookup = Promise.resolve(binding.NotificationType);
            }
        } else {
            return notification.NotificationItemCreateUpdateDamage(context);
        }
        return notifLookup.then(type => {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${type}')`, [], '').then(notifType => {
                let defect = (binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic' || (binding.InspectionLot && Number(binding.InspectionLot) !== 0)); // Are we working with a Defect Notification or not?
                if (notifType.getItem(0).NotifCategory === '02' || defect) { // QM/PM Notification, Defect
                    specifier.setDisplayValue('{{#Property:Code}} - {{#Property:CodeDescription}}');
                    specifier.setReturnValue('{Code}');

                    specifier.setEntitySet('PMCatalogCodes');
                    specifier.setService('/SAPAssetManager/Services/AssetManager.service');

                    common.setEditable(targetList, true);
                    specifier.setQueryOptions(`$filter=CodeGroup eq '${codeGroup}' and Catalog eq '${notifType.getItem(0).CatTypeDefects}'`);
                    return targetList.setTargetSpecifier(specifier);
                } else { // PM Notification, No Defect
                    return notification.NotificationItemCreateUpdateDamage(context);
                }
            });
        });
    } else {
        return notification.NotificationItemCreateUpdateDamage(context);
    }
}
