import libFormat from '../Common/Library/FormatLibrary';

//format:MM-dd-yyyy
export default function RouteDueDateInDateFormat(context) {
    let workOrder = context.binding.WorkOrder;
    return workOrder ? libFormat.formatDate(context, workOrder.DueDate) : '';
}

