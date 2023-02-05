import enableAttachmentCreate from '../../UserAuthorizations/Attachments/EnableAttachmentCreate';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';

/**
* Disable floc edit if it is not local and attachments are disabled
*/
export default function FunctionalLocationEditEnabled(context) {
    if (context.binding['@sap.isLocal']) {
        return true;
    }
    if (enableAttachmentCreate(context) && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Attachment.global').getValue())) {
        return true;
    }
    return false;
}
