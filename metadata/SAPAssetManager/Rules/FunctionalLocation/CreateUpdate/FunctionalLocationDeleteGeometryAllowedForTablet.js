import FunctionalLocationDeleteGeometryAllowed from './FunctionalLocationDeleteGeometryAllowed';
import deviceType from '../../Common/DeviceType';

export default function FunctionalLocationDeleteGeometryAllowedForTablet(context) {
    return FunctionalLocationDeleteGeometryAllowed(context).then(function(isAllowed) {
        return isAllowed && deviceType(context) === 'Tablet';
    });
}
