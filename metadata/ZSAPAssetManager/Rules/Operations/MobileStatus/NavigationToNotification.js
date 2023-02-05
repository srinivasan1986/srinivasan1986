
import cleanClientData from '../../../../SAPAssetManager/Rules/Classification/Characteristics/CharacteristicCleanUp'
import libCom from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';

export default function NavigationToNotification(pageProxy) {
    libCom.setOnCreateUpdateFlag(pageProxy, '');
    cleanClientData(pageProxy);
   return pageProxy.executeAction('/ZSAPAssetManager/Actions/Notifications/NotificationDetailsCC.action');
}


