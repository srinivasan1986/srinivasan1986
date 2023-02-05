import signatureDetails from './SignatureObjectDetails';
import getParentBinding from '../SignatureControlParentBinding';
/**
* Name of the file for Signature Control
* @param {IClientAPI} context
*/
export default function SignatureOnCreateFileName(context) {
    let contentType = context.evaluateTargetPath('#Control:SignatureCaptureFormCell/#Value').contentType;
    let fileType = contentType.split('/')[1];
    let fileName = [];
    let previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    let previousPageClientData = previousPage.getClientData();

    if (previousPageClientData.isCustomerSignature) { //Customer Signature prefix
        let customerSignaturePrefix = context.getGlobalDefinition('/SAPAssetManager/Globals/Signature/SignatureCustomerPrefix.global').getValue();
        if (customerSignaturePrefix) {
            fileName.push(customerSignaturePrefix);
        }
    } else { //Technician Signature prefix
        let technicianSignaturePrefix = context.getGlobalDefinition('/SAPAssetManager/Globals/Signature/SignatureTechnicianPrefix.global').getValue();
        if (technicianSignaturePrefix) {
            fileName.push(technicianSignaturePrefix);
        }
    }

    let parent = getParentBinding(context);

    context._context.binding = parent;
    fileName.push(signatureDetails(context));
    return fileName.join('_') + '.' + fileType;
}
