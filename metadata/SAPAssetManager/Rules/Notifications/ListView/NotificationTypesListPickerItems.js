
import libPersona from '../../Persona/PersonaLibrary';
import notificationsListGetTypesQueryOption from './NotificationsListGetTypesQueryOption';

export default function NotificationTypesListPickerItems(context) {
    return notificationsListGetTypesQueryOption(context).then(types => {
        let queryBuilder = context.dataQueryBuilder();
        
        if (libPersona.isFieldServiceTechnician(context)) {
            queryBuilder.filter(types);
        }
        queryBuilder.orderBy('NotifType');
        
        return queryBuilder;
    });
}
