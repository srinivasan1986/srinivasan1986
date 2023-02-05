import libCommon from '../../Common/Library/CommonLibrary';

export default function FunctionalLocationCreateNewFuncLocGeometry(context) {
    libCommon.setStateVariable(context, 'CreateNewGeometry', JSON.parse(context.evaluateTargetPath('#ActionResults:CreateNewGeometry').data));
    return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/CreateUpdate/FunctionalLocationCreateNewFuncLocGeometry.action').then(function() {
        return context.executeAction({'Name': '/SAPAssetManager/Actions/FunctionalLocation/CreateUpdate/FunctionalLocationUpdateGeometry.action', 'Properties': {
            'Target': {
                'EntitySet': 'MyFunctionalLocations',
                'Service' : '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink' : '/SAPAssetManager/Rules/FunctionalLocation/CreateUpdate/FunctionalLocationReadLink.js',
            },
        }}).then(function() {
            return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/CreateEntitySuccessMessageNoClosePage.action');
        });
    });
}
