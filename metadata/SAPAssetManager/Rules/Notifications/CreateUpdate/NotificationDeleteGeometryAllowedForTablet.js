import NotificationDeleteGeometryAllowed from './NotificationDeleteGeometryAllowed';
import deviceType from '../../Common/DeviceType';

export default function NotificationDeleteGeometryAllowedForTablet(context) {
    return NotificationDeleteGeometryAllowed(context).then(function(isAllowed) {
        return isAllowed && deviceType(context) === 'Tablet';
    });
}
