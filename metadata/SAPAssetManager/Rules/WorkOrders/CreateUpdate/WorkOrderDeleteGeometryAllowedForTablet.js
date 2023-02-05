import WorkOrderDeleteGeometryAllowed from './WorkOrderDeleteGeometryAllowed';
import deviceType from '../../Common/DeviceType';

export default function WorkOrderDeleteGeometryAllowedForTablet(context) {
    return WorkOrderDeleteGeometryAllowed(context).then(function(isAllowed) {
        return isAllowed && deviceType(context) === 'Tablet';
    });
}
