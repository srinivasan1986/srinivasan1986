import libCom from '../Library/CommonLibrary';
export default function FormCellNoteValidation(context) {
    const noteValue = context.getValue();
    let charLimit = libCom.getAppParam(context, 'WORKORDER', 'DescriptionLength');
    let charLimitInt = parseInt(charLimit);

    if (noteValue && noteValue.length > charLimitInt) {
        let note = noteValue.substring(0, charLimitInt);
        context.setValue(note); 
        libCom.setInlineControlError(context, context, context.localizeText('validation_maximum_field_length', [charLimit]));
        context.applyValidation();
    }
}
