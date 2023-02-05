import WorkOrderDeleteGeometryAllowed from './WorkOrderDeleteGeometryAllowed';
import deviceType from '../../Common/DeviceType';

export default function WorkOrderDeleteGeometryAllowedForPhone(context) {
    return WorkOrderDeleteGeometryAllowed(context).then(function(isAllowed) {
        return isAllowed && deviceType(context) === 'Phone';
    });
}
