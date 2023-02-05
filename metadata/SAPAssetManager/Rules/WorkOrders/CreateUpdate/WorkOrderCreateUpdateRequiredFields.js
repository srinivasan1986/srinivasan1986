import { WorkOrderLibrary as libWo } from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateRequiredFields(context) {
    let requiredFields = [
        'DescriptionNote',
        'PlanningPlantLstPkr',
        'TypeLstPkr',
        'PrioritySeg',
        'MainWorkCenterLstPkr',
    ];
    return libWo.isServiceOrderCreateUpdate(context).then((isServiceOrder) => {
        if (isServiceOrder) {
            requiredFields.push('SoldToPartyLstPkr');
        }
        return requiredFields;
    });
}
