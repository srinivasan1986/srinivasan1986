import OffsetODataDate from '../../Common/Date/OffsetODataDate';
import libNotif from '../NotificationLibrary';

export default function NotificationUpdateMalfunctionEndOnPageLoad(context) {

    let binding = context.getBindingObject();
    let formCellContainer = context.getControl('FormCellContainer');

    //Offset for local timezone
    if (binding.MalfunctionStartDate) {
        let startDate = formCellContainer.getControl('MalfunctionStartDatePicker');
        let startTime = formCellContainer.getControl('MalfunctionStartTimePicker');
        formCellContainer.getControl('BreakdownStartSwitch').setValue(true);
        startDate.setEditable(true);
        startTime.setEditable(true);
        startDate.setValue(new OffsetODataDate(context, binding.MalfunctionStartDate, binding.MalfunctionStartTime).date());
        startTime.setValue(new OffsetODataDate(context, binding.MalfunctionStartDate, binding.MalfunctionStartTime).date());
    }

    if (binding.MalfunctionEndDate) {
        let endDate = formCellContainer.getControl('MalfunctionEndDatePicker');
        let endTime = formCellContainer.getControl('MalfunctionEndTimePicker');
        formCellContainer.getControl('BreakdownEndSwitch').setValue(true);
        endDate.setEditable(true);
        endTime.setEditable(true);
        endDate.setValue(new OffsetODataDate(context, binding.MalfunctionEndDate, binding.MalfunctionEndTime).date());
        endTime.setValue(new OffsetODataDate(context, binding.MalfunctionEndDate, binding.MalfunctionEndTime).date());
    }

    let container = context.getControls()[0];

    libNotif.NotificationTaskActivityGroupQuery(context, 'CatTypeObjectParts').then(query => {
        let specifier = container.getControl('PartGroupLstPkr').getTargetSpecifier();
        specifier.setQueryOptions(query);
        container.getControl('PartGroupLstPkr').setTargetSpecifier(specifier);
    });
    // Set Damage Group picker
    libNotif.NotificationTaskActivityGroupQuery(context, 'CatTypeDefects').then(query => {
        let specifier = container.getControl('DamageGroupLstPkr').getTargetSpecifier();
        specifier.setQueryOptions(query);
        container.getControl('DamageGroupLstPkr').setTargetSpecifier(specifier);
    });

    // Set Cause Group picker
    libNotif.NotificationItemTaskActivityGroupQuery(context, 'CatTypeCauses').then(query => {
        let specifier = container.getControl('CauseGroupLstPkr').getTargetSpecifier();
        specifier.setQueryOptions(query);
        container.getControl('CauseGroupLstPkr').setTargetSpecifier(specifier);
    });

}

