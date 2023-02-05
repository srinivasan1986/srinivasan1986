import NotificationDeleteGeometryAllowed from './NotificationDeleteGeometryAllowed';
import deviceType from '../../Common/DeviceType';

export default function NotificationDeleteGeometryAllowedForPhone(context) {
    return NotificationDeleteGeometryAllowed(context).then(function(isAllowed) {
        return isAllowed && deviceType(context) === 'Phone';
    });
}
