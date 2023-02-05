import libCom from '../../Common/Library/CommonLibrary';

export default function EnableItemsScreen(context) {
    let binding = context.binding;
    if (binding) {
        let type = binding.MovementType;
        if (type === '501' || type === '301' || type === '311' || type === '201' || type === '211' || type === '261' || type === '281') {
            return libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
        }
    }
    return false;
}
