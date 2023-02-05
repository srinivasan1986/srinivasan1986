import SetMaterialUoM from './SetMaterialUoM';
import Logger from '../../Log/Logger';
import SetBatch from '../../Inventory/IssueOrReceipt/SetBatch';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function SetSerialNumbers(clientAPI) {
    libCom.setStateVariable(clientAPI, 'SerialNumbers', {actual: null, initial: null});
    libCom.getControlProxy(clientAPI.getPageProxy(),'QuantitySimple').setValue(0);
    let serialNumButton = clientAPI.getPageProxy().evaluateTargetPathForAPI('#Control:SerialPageNav');
    if (clientAPI.getValue().length) {
        let materialPickerValue = clientAPI.getValue()[0].ReturnValue;
        libCom.setStateVariable(clientAPI, 'MaterialReadLink',materialPickerValue);
        let entity = materialPickerValue;
        let service = '/SAPAssetManager/Services/AssetManager.service';
        let query = '$expand=MaterialPlant'; 
        clientAPI.read(service, entity, [], query).then(result => {
            if (result.getItem(0).MaterialPlant.SerialNumberProfile) {
                serialNumButton.setVisible(true);
            } else {
                serialNumButton.setVisible(false);
            }
        }).catch(err => {
            Logger.error(`Failed to read Online MyEquipSerialNumbers: ${err}`);
            serialNumButton.setVisible(false);
        });    
        SetMaterialUoM(clientAPI);
    } else {
        libCom.setStateVariable(clientAPI, 'MaterialReadLink','');
        serialNumButton.setVisible(false);
    }
    SetBatch(clientAPI);
}
