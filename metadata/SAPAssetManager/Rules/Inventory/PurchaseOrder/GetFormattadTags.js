export default function GetFormattedTags(clientAPI) {
    var tags = [];
    var purchaseOrder = clientAPI.binding;

    tags.push(purchaseOrder.DocumentType);

    var documentStatus = purchaseOrder.DocumentStatus;

    if (documentStatus === 'B' || !documentStatus) { //Ignore partial for now, and use open if not set
        documentStatus = 'A';
    }
    switch (documentStatus) {
        case 'A':
            tags.push(clientAPI.localizeText('open'));
            break;
        case 'B':
            tags.push(clientAPI.localizeText('inbound_document_partial'));
            break;
        case 'C':
            tags.push(clientAPI.localizeText('inbound_document_completed'));
            break;
    }
    
    return tags;
}
