import signatureCreateBDSLinkNoClose from '../Create/SignatureCreateBDSLinkNoClose';
import DownloadAndSaveMedia from '../../Documents/DownloadAndSaveMedia';
import libCommon from '../../Common/Library/CommonLibrary';

export default function SignatureCreateBDSLink(controlProxy) {
    return signatureCreateBDSLinkNoClose(controlProxy).then(() => {
        return DownloadAndSaveMedia(controlProxy).then(() => {
            libCommon.setStateVariable(controlProxy, 'ObjectCreatedName', 'Signature');
            return controlProxy.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessage.action');
        });
    })
   .catch(() => controlProxy.executeAction('/SAPAssetManager/Actions/Documents/DocumentCreateLinkFailure.action'));
}
