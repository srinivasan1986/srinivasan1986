export default function SerialNumberTitle(context) {
    if (context.binding.new) {
        return context.binding.SerialNumber + '  ' + context.localizeText('NEW');
    } else {
        return context.binding.SerialNumber;
    }
}
