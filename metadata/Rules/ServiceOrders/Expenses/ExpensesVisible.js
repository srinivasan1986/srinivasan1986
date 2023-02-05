import personaLib from '../../Persona/PersonaLibrary';
import UserFeaturesLibrary from '../../UserFeatures/UserFeaturesLibrary';

export default function ExpensesVisible(context) {
    return personaLib.isFieldServiceTechnician(context) && 
        UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Expense.global').getValue());
}
