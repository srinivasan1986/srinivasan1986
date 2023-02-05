import ODataDate from '../Common/Date/ODataDate';
/**
* Check if date in params is today or yesterday
* @param {Date} date
*/
export default function ActualDateLabel(date) {
    const defaultOdataDate = new ODataDate(date);
    const now = new ODataDate();
    const yesterday = new ODataDate((new Date()).setDate(now.date().getDate()-1));
    if (defaultOdataDate.toDBDateString() === now.toDBDateString()) {
        return 'today';
    } else if (defaultOdataDate.toDBDateString() === yesterday.toDBDateString()) {
        return 'yesterday';
    }
    return 'day';
}
