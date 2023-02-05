//import libCom from '../Common/Library/CommonLibrary';
//import enableOp from '../Operations/MobileStatus/OperationEnableMobileStatus';
//import captionOp from '../Operations/MobileStatus/OperationMobileStatusToolBarCaption';
//import enableWo from '../WorkOrders/MobileStatus/WorkOrderEnableMobileStatus';
//import captionWo from '../WorkOrders/MobileStatus/WorkOrderMobileStatusToolBarCaption';

/**
 * Refreshes the toolbar caption and enable state on WO or Operation details pages
 * @param {*} context 
 * @param {*} refresh Do we need to reload the user time entries?
 * @returns 
 */
export default function RefreshDetailsToolbar() {

    return Promise.resolve(true);

    /**
    if (libCom.getStateVariable(context,'IgnoreToolbarUpdate')) {
        return Promise.resolve(); //Do not update toolbar on return to details when a status change is pending
    }

    let pageName = libCom.getPageName(context);
    let captionMethod, enableMethod;

    if (pageName === 'WorkOrderDetailsPage') {
        captionMethod = captionWo;
        enableMethod = enableWo;
    } else if (pageName === 'WorkOrderOperationDetailsPage') {
        captionMethod = captionOp;
        enableMethod = enableOp;
    }

    if (captionMethod) {
        let pageContext = context;
        if (typeof context.setToolbarItemCaption !== 'function') {
            pageContext = context.getPageProxy();
        }
        return captionMethod(context).then(captionResult => {
            return enableMethod(context, false).then(enableResult => {
                return pageContext.setToolbarItemCaption('IssuePartTbI', captionResult).then(() => {
                    return libCom.enableToolBar(pageContext, '', 'IssuePartTbI', enableResult);
                });
            });
        });
    }
    return Promise.resolve();
    */
}
