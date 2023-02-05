import woCompleteStatus from './WorkOrderCompleteStatus';
import libCommon from '../../Common/Library/CommonLibrary';
import PDFGenerateDuringCompletion from '../../PDF/PDFGenerateDuringCompletion';

export default function WorkOrderCompleteFromWOListSwipe(context) {
    //Save the name of the page where user swipped the context menu from. It will be used later in common code that can be called from all kinds of different pages.
    libCommon.setStateVariable(context, 'contextMenuSwipePage', libCommon.getPageName(context));
    
    //Save the work order binding object first since we are coming from a context menu swipe which does not allow us to get binding object from context.binding.
    libCommon.setBindingObject(context);
    
    return woCompleteStatus(context).then(() => {
        if (libCommon.getStateVariable(context, 'IsPDFGenerate')) {
            return Promise.resolve();
        } else {
            return PDFGenerateDuringCompletion(context);
        }
    }).finally(() => {
        libCommon.removeBindingObject(context);
        libCommon.removeStateVariable(context, 'contextMenuSwipePage');
    });
}
