import ODataDate from '../../../SAPAssetManager/Rules/Common/Date/ODataDate';

export default function PeakDate(context) {
    let peakDate = new Date(context.evaluateTargetPath('#Control:PeakUsageTimeControl/#Value'));
    let odataDate = new ODataDate(peakDate);
    
    return odataDate.toDBDate(context);
}
