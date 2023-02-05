import EnableWorkOrderEdit from './EnableWorkOrderEdit';
import EnableWorkOrderCreate from './EnableWorkOrderCreate';

export default function EnableWorkOrderCreateFromWorkOrder(context) {

    if (EnableWorkOrderCreate(context)) {
        return EnableWorkOrderEdit(context).then(isEditEnabled => {
            return isEditEnabled;
        });
    } else {
        return Promise.resolve(false);
    }
}
