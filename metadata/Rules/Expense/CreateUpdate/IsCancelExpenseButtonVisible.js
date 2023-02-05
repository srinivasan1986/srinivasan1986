import libCommon from '../../Common/Library/CommonLibrary';

export default function IsCancelExpenseButtonVisible(context) {
    let reopened = libCommon.getStateVariable(context, 'ExpenseScreenReopened');

    if (reopened) {
        libCommon.setStateVariable(context, 'ExpenseScreenReopened', false);
        return true;
    }

    return false;
}
