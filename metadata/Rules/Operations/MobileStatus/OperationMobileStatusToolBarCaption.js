import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libOPMobile from './OperationMobileStatusLibrary';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import phaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import libPersona from '../../Persona/PersonaLibrary';

export default function OperationMobileStatusToolBarCaption(context, mobileStatus) {

    return libClock.reloadUserTimeEntries(context).then(() => {
        let ready = 'READY'; // Don't bother adding this to the config panel. EAM Team needs to fix their hardcoded app transitions first. See TODO in Rules/Operations/MobileStatus/OperationChangeStatusPopover.js.
        let received = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
        let hold = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
        let started = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        let transfer = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
        let complete = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        let review = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        let rejected = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global').getValue());
        let accepted = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
        let travel = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
        let onsite = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());

        if (!mobileStatus)
            mobileStatus = libMobile.getMobileStatus(context.binding, context);

        //Change operation status when assignment type is at operation level.
        if (libMobile.isOperationStatusChangeable(context)) {
            if (libClock.isBusinessObjectClockedIn(context) && mobileStatus.toUpperCase() === started) {
                return Promise.resolve(context.localizeText('clock_out'));
            } else {
                if (mobileStatus === ready || mobileStatus === received || mobileStatus === hold) {
                    //This operation is not started. It is currently either on hold or received status.
                    let isAnyOtherOperationStartedPromise = libOPMobile.isAnyOperationStarted(context);
                    return isAnyOtherOperationStartedPromise.then(
                        isAnyOtherOperationStarted => {
                            if (libPersona.isFieldServiceTechnician(context)) {
                                if (mobileStatus === received) {
                                    return Promise.resolve(context.localizeText('accept'));
                                } else {
                                    if (libClock.isCICOEnabled(context)) {
                                        return Promise.resolve(context.localizeText('clock_in'));
                                    } else {
                                        return Promise.resolve(context.localizeText('start_operation'));
                                    }
                                }
                            }
                            if (isAnyOtherOperationStarted && !phaseModelEnabled(context)) { // Transfer not allowed in 9-phase model
                                return Promise.resolve(context.localizeText('transfer'));
                            } else {
                                if (libClock.isCICOEnabled(context)) {
                                    return Promise.resolve(context.localizeText('clock_in'));
                                } else {
                                    return Promise.resolve(context.localizeText('start_operation'));
                                }
                            }
                        }
                    );
                } else if (mobileStatus === accepted || mobileStatus === onsite) {
                    let isAnyOtherOperationStartedPromise = libOPMobile.isAnyOperationStarted(context);
                    return isAnyOtherOperationStartedPromise.then(isAnyOtherOperationStarted => { 
                        if (isAnyOtherOperationStarted) {
                            return Promise.resolve(context.localizeText('enroute')); //We will have only one action if anything is started
                        } else {
                            if (libClock.isCICOEnabled(context)) {
                                return Promise.resolve(context.localizeText('clock_in'));
                            } else {
                                return Promise.resolve(context.localizeText('start_operation'));
                            }
                        }
                    });
                } else if (mobileStatus === travel) {
                    return Promise.resolve(context.localizeText('onsite'));
                } else if (mobileStatus === started) {
                    if (libClock.isCICOEnabled(context)) { //Handle clock in/out feature
                        if (libClock.isBusinessObjectClockedIn(context)) { //JCL 2205 patch
                            return Promise.resolve(context.localizeText('clock_out'));
                        } else {
                            return Promise.resolve(context.localizeText('clock_in')); //This Operation was started by someone else, so current user can also start it
                        }
                    } else {
                        return Promise.resolve(context.localizeText('end_operation'));
                    }
                } else if (mobileStatus === transfer) {
                    return Promise.resolve(context.localizeText('transferred'));
                } else if (mobileStatus === complete) {
                    return Promise.resolve(context.localizeText('completed'));
                } else if (mobileStatus === review) {
                    return libSuper.isUserSupervisor(context).then(result => {
                        if (result) { //Supervisor has approve/reject option
                            return Promise.resolve(context.localizeText('review_text'));
                        }
                        return Promise.resolve(context.localizeText('restart_operation'));
                    });
                } else if (mobileStatus === rejected) {
                    if (libPersona.isFieldServiceTechnician(context)) {
                        return Promise.resolve(context.localizeText('rejected'));
                    }
                    return libSuper.isUserSupervisor(context).then(result => {
                        if (result) {
                            return Promise.resolve(context.localizeText('edit_review')); //Supervisor can edit any review
                        }
                        let isAnyOtherOperationStartedPromise = libOPMobile.isAnyOperationStarted(context);
                        return isAnyOtherOperationStartedPromise.then(isAnyOtherOperationStarted => { //Tech will see the start or transfer option
                            if (isAnyOtherOperationStarted && !phaseModelEnabled(context)) { // Transfer not allowed in 9-phase model
                                return Promise.resolve(context.localizeText('transfer'));
                            } else {
                                if (libClock.isCICOEnabled(context)) {
                                    return Promise.resolve(context.localizeText('clock_in'));
                                } else {
                                    return Promise.resolve(context.localizeText('start_operation'));
                                }
                            }
                        });
                    });
                }
                return Promise.resolve(context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/Status.global').getValue());
            }
        } else {
            //Change operation status when assignment type is at work order header level.
            return libMobile.isMobileStatusConfirmed(context).then(result => {
                if (result) {
                    return Promise.resolve(context.localizeText('unconfirm'));
                } else {
                    return Promise.resolve(context.localizeText('confirm'));
                }
            });
        }
    });
}
