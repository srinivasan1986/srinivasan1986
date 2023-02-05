import isAndroid from '../Common/IsAndroid';

export default function NotificationPriorityStatusStyle(context) {

    let binding = context.getBindingObject();
 
     if (binding && binding.NotifPriority && binding.NotifPriority.PriorityDescription) {
        let veryHighPriority = '1-Very high';
        let highPriority = '2-High';
        let mediumPriority = '3-Medium';
         
        var priority = binding.NotifPriority.PriorityDescription;
        
        if (isAndroid(context)) {
            if (priority === veryHighPriority || priority === highPriority) {
                return 'AndroidHighPriorityRed';
            } else if (priority === mediumPriority) {
                return 'AndroidMediumPriorityOrange';
            }
        } else {
            if (priority === veryHighPriority || priority === highPriority) {
                return 'IosHighPriorityRed';
            } else if (priority === mediumPriority) {
                return 'IosMediumPriorityOrange';
            }
        }
    }
     return '';
 }  
