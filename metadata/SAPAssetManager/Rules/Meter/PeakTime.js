import ODataDate from '../../../SAPAssetManager/Rules/Common/Date/ODataDate';

export default function PeakTime(context) {
    let peakTime = context.evaluateTargetPath('#Control:PeakUsageTimeControl/#Value');
    let odataDate = new ODataDate(peakTime).toDBTimeString(context).split(':');

    return odataDate[0] + ':' + odataDate[1];
}
