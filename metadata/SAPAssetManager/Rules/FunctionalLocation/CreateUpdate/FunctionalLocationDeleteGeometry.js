import GeometryDelete from '../../Geometries/GeometryDelete';

export default function FunctionalLocationDeleteGeometry(context) {
    return context.executeAction('/SAPAssetManager/Actions/DiscardWarningMessage.action').then( result => {
        if (result.data === true) {
            return GeometryDelete(context, 'Geometry_Nav', 'Geometries').then(() => {
                return GeometryDelete(context, 'FuncLocGeometries', 'MyFuncLocGeometries').then(() => {
                    if (context.getPageProxy()._page.id === 'MapExtensionControlPage' ||
                        context.getPageProxy()._page.id === 'SideMenuMapExtensionControlPage') {
                        return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessageNoClosePage.action');
                    }
                    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action');
                }).catch(() => {
                    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntityFailureMessage.action');
                });
            }).catch(() => {
                return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntityFailureMessage.action');
            });
        }
        return Promise.resolve();
    });
}
