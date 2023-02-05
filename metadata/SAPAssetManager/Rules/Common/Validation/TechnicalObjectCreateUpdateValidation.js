import DocumentLibrary from '../../Documents/DocumentLibrary';
import DescriptionNoteControl from '../Controls/DescriptionNoteControl';
import CommonLibrary from '../Library/CommonLibrary';

export default function createUpdateValidationRule(pageProxy) {
    let valPromises = [];

    let allControls = pageProxy.getControl('FormCellContainer').getControls();
    for (let item of allControls) {
        CommonLibrary.setInlineControlErrorVisibility(item, false);
    }
    pageProxy.getControl('FormCellContainer').redraw();

    // get all of the validation promises
    valPromises.push(DescriptionNoteControl.validationCharLimit(pageProxy));

    // check attachment count, run the validation rule if there is an attachment
    if (DocumentLibrary.attachmentSectionHasData(pageProxy)) {
        valPromises.push(DocumentLibrary.createValidationRule(pageProxy));
    }

    // check all validation promises;
    // if all resolved -> return true
    // if at least 1 rejected -> return false
    return Promise.all(valPromises).then((results) => {
        const pass = results.reduce((total, value) => {
            return total && value;
        });
        if (!pass) {
            throw false;
        }
        return true;
    }).catch(() => {
        let container = pageProxy.getControl('FormCellContainer');
        container.redraw();
        return false;
    });
}
