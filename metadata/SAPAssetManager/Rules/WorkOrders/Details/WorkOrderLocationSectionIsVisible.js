import { WorkOrderLibrary as libWo } from '../WorkOrderLibrary';

/**
 * Hide WorkOrderLocationSection for service orders. Service orders have their own location section that's different than this one.
 * Show for all other types of orders.
 * 
 * @param {*} context 
 * @returns true if not a service order.
 */
export default function WorkOrderLocationSectionIsVisible(context) {
    return libWo.isServiceOrder(context).then(isSrvOrd => {
        return !isSrvOrd;
    });
}
