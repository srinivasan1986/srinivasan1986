export default function MaterialDocShowAccessoryIcon(context) {
    const binding = context.binding;

    if (binding['@sap.isLocal']) {
        return '$(PLT, /SAPAssetManager/Images/edit-accessory.ios.png, /SAPAssetManager/Images/edit-accessory.android.png)';
    }

    return '';
}
