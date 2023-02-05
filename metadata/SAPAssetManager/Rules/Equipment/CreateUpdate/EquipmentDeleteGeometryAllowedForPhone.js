import EquipmentDeleteGeometryAllowed from './EquipmentDeleteGeometryAllowed';
import deviceType from '../../Common/DeviceType';

export default function EquipmentDeleteGeometryAllowedForPhone(context) {
    return EquipmentDeleteGeometryAllowed(context).then(function(isAllowed) {
        return isAllowed && deviceType(context) === 'Phone';
    });
}
