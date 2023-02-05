import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';

export default function InspectionPointUpdateValidation(context) {
    libCom.setInlineControlErrorVisibility(libCom.getControlProxy(context, 'Valuation'), false);
    libCom.getControlProxy(context, 'Valuation').clearValidation();
    let message = context.localizeText('field_is_required');
    if (libVal.evalIsEmpty(context.binding.ClientData) || libVal.evalIsEmpty(context.binding.ClientData.Valuation)) {
        libCom.setInlineControlError(context, libCom.getControlProxy(context, 'Valuation'), message);
        context.getControl('FormCellContainer').redraw();
        return Promise.reject(false);
    }
    return Promise.resolve(true);
}
