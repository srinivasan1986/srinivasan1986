import dateLabel from '../../DateTime/DateLabel';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
/**
* Providing header with actual date info
* @param {IClientAPI} context
*/

export default function HeaderInfo(context) {
    const defaultDate = libWO.getActualDate(context);
    const actualValue = dateLabel(defaultDate);
    let today = context.localizeText('day');
    let actualDate = `${defaultDate.toUTCString().split(' ')[2]} ${defaultDate.getDate()}`;
    switch (actualValue) {
        case 'today':
            today = context.localizeText('day_today');
            break;
        case 'yesterday':
            today = context.localizeText('day_yesterday');
            break;
        default:
            break;
    }
    return context.localizeText('date_dot_formatter', [today, actualDate]);
}
