import libCommon from '../../Common/Library/CommonLibrary';

export default function OnExpenseCreateSuccess(context) {
    return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
        if (!libCommon.getStateVariable(context, 'expenseDiscardEnabled')) {
            libCommon.setStateVariable(context, 'ExpenseEditMode', false);
            if (libCommon.getStateVariable(context, 'IsWOCompletion')) {
                let binding = context.getPageProxy().getBindingObject();
                libCommon.setStateVariable(context, 'WOBinding', binding);
                context.setActionBinding(binding);
            }
            return context.executeAction('/SAPAssetManager/Actions/Expense/ExpenseListNav.action');
        }
        return Promise.resolve();
    });
}
