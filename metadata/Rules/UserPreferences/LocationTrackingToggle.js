
import libLocationTracking from '../LocationTracking/LocationTrackingLibrary';
import libPersona from '../Persona/PersonaLibrary';

export default function LocationTrackingToggle(context) {
    let userSwitch = context.evaluateTargetPath('#Page:UserProfileSettings/#Control:LocationTrackingSwitch');
    let isOn = userSwitch.getValue();
    let persona = libPersona.getActivePersona(context);

    if (isOn && libLocationTracking.getUserSwitch(context, persona) === 'off') {
        return libLocationTracking.enableService(context).then((isEnabled) => {
            if (isEnabled) {
                libLocationTracking.setUserSwitch(context, persona, 'on');
                userSwitch.setValidationProperty('ValidationMessage',
                    context.localizeText('location_tracking_enabled_prompt'));
            } else { // turn off the switch control immediately
                userSwitch.setValue(false);
                userSwitch.setValidationProperty('ValidationMessage',
                    context.localizeText('location_tracking_disabled_prompt'));
            }
            context.redraw();
        });
    } else if (!isOn && libLocationTracking.getUserSwitch(context, persona) === 'on') {
        libLocationTracking.disableService(context);
        libLocationTracking.setUserSwitch(context, persona, 'off');
    }
}
