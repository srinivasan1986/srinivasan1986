import documentCreateBDSLinkNoClose from './DocumentCreateBDSLinkNoClose';
import DownloadAndSaveMedia from '../DownloadAndSaveMedia';
import libCom from '../../Common/Library/CommonLibrary';

export default function DocumentCreateBDSLink(controlProxy) {
    return documentCreateBDSLinkNoClose(controlProxy).then(() => {
        return DownloadAndSaveMedia(controlProxy).then(() => {
            libCom.setStateVariable(controlProxy, 'ObjectCreatedName', 'Document');
            controlProxy.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action');
        });
    })
   .catch(() => controlProxy.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action'));
}
