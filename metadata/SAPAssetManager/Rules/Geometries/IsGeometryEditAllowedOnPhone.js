import deviceType from '../Common/DeviceType';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function IsGeometryEditAllowedOnPhone(context) {
    const id = context.getPageProxy()._page.previousPage.id;
    return deviceType(context) === 'Phone' &&
           id !== 'MapExtensionControlPage' && id !== 'SideMenuMapExtensionControlPage' &&
           userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GISAddEdit.global').getValue());
}
