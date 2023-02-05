/**
 * Don't close the page when coming from the Error Archive or 
 * when deleting a mileage confirmation because we're doing this directly on the list screen
 * @param {*} context 
 * @returns 
 */

import MileageActivityType from '../../ServiceOrders/Mileage/MileageActivityType';

export default function ConfirmationDeleteOnSuccess(context) {
    let binding = context.binding;
    let dontClosePage = false;

    let fromErrorArchive = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().FromErrorArchive; //save this here before the context changes

    dontClosePage = (MileageActivityType(context) && binding.ActivityType === MileageActivityType(context)) || fromErrorArchive;

    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/DeleteEntitySuccessMessage.action').then(() => {
        if (dontClosePage) {
            return Promise.resolve(true);
        } else {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        }
    });
}
