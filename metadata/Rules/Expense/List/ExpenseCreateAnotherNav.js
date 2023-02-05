import libCommon from '../../Common/Library/CommonLibrary';

export default function ExpenseCreateAnotherNav(context) {
    libCommon.setOnCreateUpdateFlag(context, 'CREATE');
    if (libCommon.getStateVariable(context, 'IsWOCompletion')) {
        let binding = libCommon.getStateVariable(context, 'WOBinding');
        context.getPageProxy().setActionBinding(binding);
    }
    context.getPageProxy().executeAction('/SAPAssetManager/Actions/Expense/ExpenseCreateUpdateNav.action');
}
