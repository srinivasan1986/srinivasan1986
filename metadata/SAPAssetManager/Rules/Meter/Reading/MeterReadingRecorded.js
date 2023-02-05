import libCommon from '../../Common/Library/CommonLibrary';

export default function MeterReadingRecorded(context) {
    let equipment = context.binding.EquipmentNum;
    let register = context.binding.RegisterNum;
    if (!libCommon.isDefined(equipment)) {
        equipment = context.evaluateTargetPathForAPI('#Page:MeterDetailsPage').binding.EquipmentNum;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}'&$orderby=MeterReadingDate desc`).then(function(result) {
        if (result && result.length > 0) {
            return result.getItem(0).MeterReadingRecorded;
        } else {
            return '';
        }
    });
}
