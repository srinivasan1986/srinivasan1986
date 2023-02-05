/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function ObjectPartCatalogType(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${context.evaluateTargetPath('#Control:TypeLstPkr/#SelectedValue')}')`, [], '').then(result => {
        if (result && result.length === 1) {
            return result.getItem(0).CatTypeObjectParts;
        } else {
            return '';
        }
    });
}
