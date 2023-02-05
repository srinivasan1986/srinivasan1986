import libCom from '../../Common/Library/CommonLibrary';
import libPart from '../PartLibrary';
import style from '../../Common/Style/StyleFormCellButton';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';
import EnableMultipleTechnician from '../../SideDrawer/EnableMultipleTechnician';

export default function PartCreateUpdateOnPageLoad(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    hideCancel(context);
    style(context, 'DiscardButton');

    let isMultipleTechnician = EnableMultipleTechnician(context);
    let binding = context.binding;
    let textCategory = libCom.getAppParam(context, 'PART', 'TextItemCategory');
    let textDescription = context.localizeText('text_item');
    let description = binding && libPart.getPartPlusDescription(context, binding.ItemCategory, textCategory, binding.TextTypeDesc, textDescription, binding.ComponentDesc, binding.MaterialNum, true, true);
    if (libCom.IsOnCreate(context) || isMultipleTechnician) {
        description = context.localizeText('add_part');
    } else {
        description = context.localizeText('edit_part');
    }

    context.setCaption(description);
    let partCategoryValue = context.evaluateTargetPath('#Control:PartCategoryLstPkr').getValue()[0].ReturnValue;

    if (partCategoryValue === textCategory) {
        // Disable Stock Item pickers
        context.evaluateTargetPath('#Control:MaterialLstPkr').setVisible(false);
        context.evaluateTargetPath('#Control:MaterialUOMLstPkr').setVisible(false);
        if (!isMultipleTechnician) {
            context.evaluateTargetPath('#Control:StorageLocationLstPkr').setVisible(false);
            context.evaluateTargetPath('#Control:UOMSim').setVisible(false);
    
            // Enable Text Picker items
            context.evaluateTargetPath('#Control:TextItemSim').setVisible(true);
        }
        
    }
    libCom.saveInitialValues(context);
}
