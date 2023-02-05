import {guid} from '../../../SAPAssetManager/Rules/Common/guid'
import ODataDate from '../../../SAPAssetManager/Rules/Common/Date/ODataDate';
import common from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import OperationMobileStatusLibrary from '../../../SAPAssetManager/Rules/Operations/MobileStatus/OperationMobileStatusLibrary';
import supervisor from '../../../SAPAssetManager/Rules/Supervisor/SupervisorLibrary';
import noteWrapper from '../../../SAPAssetManager/Rules//Supervisor/MobileStatus/NoteWrapper';
import {ChecklistLibrary} from '../../../SAPAssetManager/Rules/Checklists/ChecklistLibrary';
import phaseModelEnabled from '../../../SAPAssetManager/Rules/Common/IsPhaseModelEnabled';
import libClock from '../../../SAPAssetManager/Rules/ClockInClockOut/ClockInClockOutLibrary';
import libMobile from '../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import CompleteOperationMobileStatusAction from '../../../SAPAssetManager/Rules/Operations/MobileStatus/CompleteOperationMobileStatusAction';
import LocationUpdate from '../../../SAPAssetManager/Rules/MobileStatus/LocationUpdate';
import pdfAllowedForOperation from '../../../SAPAssetManager/Rules/PDF/IsPDFAllowedForOperation';
import mileageAddNav from '../../../SAPAssetManager/Rules/ServiceOrders/Mileage/MileageAddNav';
import expenseCreateNav from '../../../SAPAssetManager/Rules/Expense/CreateUpdate/ExpenseCreateNav';
import mobileStatusHistoryEntryCreate from '../../../SAPAssetManager/Rules/MobileStatus/MobileStatusHistoryEntryCreate';
import ExpensesVisible from '../../../SAPAssetManager/Rules/ServiceOrders/Expenses/ExpensesVisible';
import MileageIsEnabled from '../../../SAPAssetManager/Rules/ServiceOrders/Mileage/MileageIsEnabled';
import PDFGenerateDuringCompletion from '../../../SAPAssetManager/Rules/PDF/PDFGenerateDuringCompletion';   
import refreshToolbar from '../../../SAPAssetManager/Rules/MobileStatus/RefreshDetailsToolbar';

/* Added Import of Meter Library to check the Meter is  processed or not*/
import meterLib from '../../../SAPAssetManager/Rules/Meter/Common/MeterLibrary';
import meterEntitySet from '../../../SAPAssetManager/Rules/Meter/MetersListViewEntitySet';
import meterQueryOption from '../../../SAPAssetManager/Rules/Meter/MetersListViewQueryOptions';



function rollbackMobileStatus(context, mobileStatusEditLink, showBanner) {
    let actionObject = {
        'Name' : '/SAPAssetManager/Actions/Common/GenericDiscard.action',
        'Properties': {
            'Target': {
                'EntitySet': 'PMMobileStatuses',
                'EditLink': mobileStatusEditLink,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
        },
    };

    if (showBanner) {
        actionObject.OnSuccess = {
            'Name': '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action',
            'Properties': {
                'Message': '$(L,assign_failure)',
            },
        };
    }
    return context.executeAction(actionObject).then(result => {
        try {
            return JSON.parse(result.data);
        } catch (exc) {
            return {};
        }
    });
}

function rollbackAssignment(context, assignmentEditLink) {
    return context.executeAction({
        'Name' : '/SAPAssetManager/Actions/Common/GenericDiscard.action',
        'Properties': {
            'Target': {
                'EntitySet': 'WorkOrderTransfers',
                'EditLink': assignmentEditLink,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
        },
    }).then(result => {
        try {
            return JSON.parse(result.data);
        } catch (exc) {
            return {};
        }
    });
}

function assignToSelf(context, binding, updateResult) {
    if (binding.PersonNum === '00000000') {
        let employee = common.getPersonnelNumber();
        return context.executeAction({
            'Name' : '/SAPAssetManager/Actions/MobileStatus/OperationSelfAssign.action',
            'Properties': {
                'Properties': {
                    'OperationNo': binding.OperationNo,
                    'OrderId': binding.OrderId,
                    'EmployeeTo': employee,
                },
            },
        }).then((selfAssign) => {
            selfAssign = JSON.parse(selfAssign.data);
            // Only attempt to upload Operation Transfer if device is online
            if (context.getPageProxy().nativescript.connectivityModule.getConnectionType() > 0) {
                // Upload the created WorkOrderTransfer record
                return context.executeAction('/SAPAssetManager/Actions/MobileStatus/OperationTransferUpload.action').then(() => {
                    // Check Error Archive to see if issues occurred during assignment
                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', [], "$filter=RequestMethod eq 'POST' and RequestURL eq '/WorkOrderTransfers'").then(entries => {
                        if (entries.length === 0) {
                            // If no errors, re-download Operation and proceed to update toolbar
                            return context.executeAction({
                                'Name': '/SAPAssetManager/Actions/MobileStatus/OperationTransferDownload.action',
                                'Properties': {
                                    'DefiningRequests' : [{
                                        'Name': 'MyWorkOrderOperations',
                                        'Query': `$filter=OrderId eq '${binding.OrderId}' and OperationNo eq '${binding.OperationNo}'`,
                                    }],
                                },
                            }).then(() => {
                                // Update PersonNum so subsequent transitions don't trigger an upload
                                binding.PersonNum = employee;
                            });
                        } else {
                            // If errors occurred trying to assign operation, roll back Overall Status and delete all related ErrorArchive entries (normally should only be one)
                            let actionPromises = [];
                            entries.forEach(entry => {
                                actionPromises.push(context.executeAction({
                                    'Name' : '/SAPAssetManager/Actions/Common/ErrorArchiveDiscard.action',
                                    'Properties': {
                                        'OnSuccess': '',
                                        'OnFailure': '',
                                        'Target': {
                                            'EntitySet': 'ErrorArchive',
                                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                                            'QueryOptions': `$filter=RequestID eq ${entry.RequestID}`,
                                        },
                                    },
                                }));
                            });
                            return Promise.all(actionPromises).then(() => {
                                return rollbackMobileStatus(context, updateResult['@odata.editLink'], true).then(result => {
                                    // Hack -- See MobileStatusPopover.js
                                    binding.OperationMobileStatus_Nav.MobileStatus = result.MobileStatus;
                                });
                            });
                        }
                    });
                }, () => {
                    // If upload fails due to a network issue, roll back Overall Status and Transfer
                    let promises = [];
                    promises.push(rollbackMobileStatus(context, updateResult['@odata.editLink']), true);
                    promises.push(rollbackAssignment(context, selfAssign['@odata.editLink']), true);

                    return Promise.all(promises).then(rollbackResults => {
                        // Hack -- See MobileStatusPopover.js
                        binding.OperationMobileStatus_Nav.MobileStatus = rollbackResults[0].MobileStatus;
                    });
                });
            } else {
                // "Transfer" operation so client doesn't think it's unassigned
                return context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationUpdateAssignment.action',
                    'Properties': {
                        'Properties': {
                            'PersonNum' : employee,
                        },
                        'Headers': {
                            'Transaction.Ignore': 'true',
                        },
                    },
                });
            }
        });
    } else {
        return Promise.resolve();
    }
}

/**
* Mobile Status post-update rule
* @param {IClientAPI} context
*/
export default function OperationMobileStatusPostUpdate(context) {
    const cicoEnabled = libClock.isCICOEnabled(context);
    const STARTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const REVIEW = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const userGUID = common.getUserGuid(context);
    const userId = common.getSapUserName(context);
    const ORDERTYPEISSUE = context.getGlobalDefinition('/ZSAPAssetManager/Globals/MobileStatus/ParameterNames/OrderTypeIssueParameterName.global').getValue(); // Custom OrderType issue for GAP181
    const updateResult = (() => {
        try {
            let data = JSON.parse(context.getActionResult('MobileStatusUpdate').data);
            if (data.MobileStatus === 'D-COMPLETE') {
                data.MobileStatus = COMPLETE;
            }
            if (data.MobileStatus === 'D-REVIEW') {
                data.MobileStatus = REVIEW;
            }
            return data;
        } catch (exc) {
            // If no action result, assume no mobile status change (CICO) -- return existing PM Mobile Status
            return context.binding.OperationMobileStatus_Nav;
        }
    })();

    let UpdateCICO = function() {
        let requiresCICO = true;
        // Save timestamp for confirmation/CATS
        let odataDate = new ODataDate();
        common.setStateVariable(context, 'StatusStartDate', odataDate.date());

        // Create relevant CICO entry
        let cicoValue = '';
        switch (updateResult.MobileStatus) {
            case STARTED:
                cicoValue = cicoEnabled ? 'CLOCK_IN' : 'START_TIME';
                break;
            case HOLD:
            case COMPLETE:
            case REVIEW:
                cicoValue = cicoEnabled ? 'CLOCK_OUT' : 'END_TIME';
                break;
            default:
                break;
        }
        if (updateResult.MobileStatus === COMPLETE) {
            requiresCICO = libClock.isBusinessObjectClockedIn(context);  //Only clock out if this object is clocked in.  Handles supervisor approving a technician's work case
        }

        if (cicoValue && requiresCICO) { //Only add to CICO if status requires
            return context.executeAction({'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                'Properties': {
                    'RecordId': guid(),
                    'UserGUID': userGUID,
                    'OperationNo': context.binding.OperationNo,
                    'SubOperationNo': '',
                    'OrderId': context.binding.OrderId,
                    'PreferenceGroup': cicoValue,
                    'PreferenceName': context.binding.OrderId,
                    'PreferenceValue': odataDate.toDBDateTimeString(context),
                    'UserId': userId,
                },
                'CreateLinks': [{
                    'Property': 'WOOperation_Nav',
                    'Target':
                    {
                        'EntitySet': 'MyWorkOrderOperations',
                        'ReadLink': `MyWorkOrderOperations(OrderId='${context.binding.OrderId}',OperationNo='${context.binding.OperationNo}')`,
                    },
                }],
            }}).then(() => {
                if (updateResult.MobileStatus === 'HOLD' || updateResult.MobileStatus === 'COMPLETE') {
                    return OperationMobileStatusLibrary.showTimeCaptureMessage(context);
                } else {
                    return Promise.resolve();
                }
            });
        } else {
            if (updateResult.MobileStatus === 'HOLD' || updateResult.MobileStatus === 'COMPLETE') {
                return OperationMobileStatusLibrary.showTimeCaptureMessage(context);
            } else {
                return Promise.resolve();
            }
        }
    };

    common.setStateVariable(context,'IgnoreToolbarUpdate', true); //Do not update toolbar 'on return' during status change
    if (updateResult.MobileStatus === COMPLETE || updateResult.MobileStatus === REVIEW) {
        return CheckDisconnectionCC(context).then(result => { // Custom condition check for GAP181
            if (result) {
                return ChecklistLibrary.allowWorkOrderComplete(context, context.binding.HeaderEquipment, context.binding.HeaderFunctionLocation).then(results => { //Check for non-complete checklists and ask for confirmation
                    if (results === true) {
                        return OperationMobileStatusLibrary.completeOperation(context, updateResult, () => { // May throw rejected Promise if signature required and declined
                            return libMobile.NotificationUpdateMalfunctionEnd(context, context.binding);
                        }).catch(() => {
                            // Roll back mobile status update
                            return Promise.reject();
                        });
                    } else {
                        return Promise.resolve();
                    }
                }).then(() => {
                    return supervisor.checkReviewRequired(context, context.binding).then(reviewRequired => {
                        context.binding.SupervisorDisallowFinal = '';
                        if (reviewRequired) {
                            context.binding.SupervisorDisallowFinal = true; //Tech cannot set final confirmation on review
                        }
                        return noteWrapper(context, reviewRequired).then(() => { //Allow tech to leave note for supervisor
                            context.getClientData().ChangeStatus = updateResult.MobileStatus;
                            return OperationMobileStatusLibrary.showTimeCaptureMessage(context, !reviewRequired, updateResult.MobileStatus);
                        });
                    });
                }).then(() => {
                    let executeExpense = false;
                    let executeMilage = false;
                    let executePDF = false;
                    if (ExpensesVisible(context)) {
                        executeExpense = true;
                    }
                    if (MileageIsEnabled(context)) {
                        common.setStateVariable(context, 'IsOperationCompletion', true);
                        executeMilage = true;
                    }
                    if (pdfAllowedForOperation(context)) {
                        executePDF = true;
                    }
                    common.setStateVariable(context, 'IsExecuteExpense', executeExpense);
                    common.setStateVariable(context, 'IsExecuteMilage', executeMilage);
                    common.setStateVariable(context, 'IsPDFGenerate', executePDF);
                    if (executeExpense) {
                        return expenseCreateNav(context);
                    } else if (executeMilage) {
                        return mileageAddNav(context);
                    } else {
                        return Promise.resolve();
                    }
                }).then(() => {
                    libMobile.phaseModelStatusChange(context, updateResult.MobileStatus);
                    return UpdateCICO().then(() => {
                        let actionArgs = {
                            OperationId: context.binding.OperationNo,
                            WorkOrderId: context.binding.OrderId,
                            isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
                            isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
                            didCreateFinalConfirmation: common.getStateVariable(context, 'IsFinalConfirmation', common.getPageName(context)),
                        };
                        let action = new CompleteOperationMobileStatusAction(actionArgs);
                        context.getClientData().confirmationArgs = {
                            doCheckOperationComplete: false,
                        };
                        context.getClientData().mobileStatusAction = action;
                        return action.execute(context).then((result) => {
                            if (result) {
                                LocationUpdate(context);
                                if (updateResult.MobileStatus === COMPLETE) {
                                    if (common.getStateVariable(context, 'IsPDFGenerate') &&
                                        (common.getStateVariable(context, 'IsExecuteMilage') || common.getStateVariable(context, 'IsExecuteExpense'))) {
                                        return UpdateToolbarCaption(context);
                                    } else {
                                        return PDFGenerateDuringCompletion(context).then(() => {
                                            return UpdateToolbarCaption(context);
                                        });
                                    }
                                }
                                return UpdateToolbarCaption(context);
                            }
                            return Promise.reject();
                        });
                    });
                }).catch(() => {
                    // Roll back mobile status update
                    return context.executeAction('/SAPAssetManager/Rules/MobileStatus/PhaseModelStatusUpdateRollback.js').then(() => {
                        return UpdateToolbarCaption(context);
                    });
                });
            } else { 
                // Roll back mobile status update and navigate to Notification details page for meter 
                updateResult.MobileStatus = ORDERTYPEISSUE;
                context.getClientData().ChangeStatus = updateResult.MobileStatus;
                return context.executeAction('/SAPAssetManager/Rules/MobileStatus/PhaseModelStatusUpdateRollback.js').then(() => {
                    return UpdateToolbarCaption(context).then(() => {
                        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [], "$filter=NotificationNumber eq '" + context.binding.WOHeader.NotificationNumber + "'&$expand=WorkOrder,NotifPriority,NotifMobileStatus_Nav,NotifDocuments,NotifDocuments/Document,HeaderLongText,FunctionalLocation,Equipment,NotifMobileStatus_Nav/OverallStatusCfg_Nav").then(results => {
                            let pageProxy = context.getPageProxy();
                            let notificationHeaderBinding = results.getItem(0);
                            pageProxy.setActionBinding(notificationHeaderBinding);
                            return pageProxy.executeAction('/ZSAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessageCustom.action').then(() => {
                                return Promise.reject();
                            });
                        });
                    }).catch(() => {
                        return Promise.reject();
                    }).catch(() => {
                        return Promise.reject();
                    });
                });
            }
        }).catch(() => {
            // Roll back mobile status update
            return context.executeAction('/SAPAssetManager/Rules/MobileStatus/PhaseModelStatusUpdateRollback.js').then(() => {
                return UpdateToolbarCaption(context);
            });
        });
    } else {
        let selfAssignPromise = Promise.resolve();
        if (phaseModelEnabled(context)) {
            selfAssignPromise = assignToSelf(context, context.binding, updateResult);
        }
        return selfAssignPromise.then(() => {
            LocationUpdate(context);
            libMobile.phaseModelStatusChange(context, updateResult.MobileStatus);
            return UpdateCICO().then(() => {
                const properites = {
                    'ObjectKey': updateResult.ObjectKey,
                    'ObjectType': common.getAppParam(context, 'OBJECTTYPE', 'Operation'),
                    'MobileStatus': updateResult.MobileStatus,
                    'EffectiveTimestamp': updateResult.EffectiveTimestamp,
                    'CreateUserGUID': updateResult.CreateUserGUID,
                    'CreateUserId': updateResult.CreateUserId,
                };
                return mobileStatusHistoryEntryCreate(context, properites, updateResult['@odata.readLink']).then(() => {
                    return UpdateToolbarCaption(context);
                });
            });
        });
    }
}

/**
 * Update the screen's toolbar and enable status
 * @param {*} caption 
 * @returns 
 */
 function UpdateToolbarCaption(context) {

    common.removeStateVariable(context,'IgnoreToolbarUpdate');
    return refreshToolbar(context);

}

/**
 * Check the Disconnection CC for exception PP list for GAP181
 * @param {*} caption 
 * @returns 
 */

function CheckDisconnectionCC(context) {
    const exceptionPP = common.getAppParam(context, 'ZEXCEPTIONS', 'EnforceDisconnectByPlants');
    let exceptionPPArray = null;
    if (exceptionPP.length > 0) {
        exceptionPPArray = exceptionPP.split(",");
        if ((context.binding.WOHeader.OrderType === "0010" || context.binding.WOHeader.OrderType === "0013") && exceptionPPArray.includes(context.binding.WOHeader.PlanningPlant)) { //Check for Disconnection OrderType and PP 
            let localBinding = context.getBindingObject();
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderISULinks', [], "$filter=OrderNum eq '" + context.binding.OrderId + "'&$expand=Workorder_Nav/DisconnectActivity_Nav/DisconnectObject_Nav,Installation_Nav,Device_Nav,Premise_Nav,Device_Nav/DeviceCategory_Nav/Material_Nav,Device_Nav/RegisterGroup_Nav/Division_Nav,Device_Nav/Equipment_Nav/ObjectStatus_Nav/SystemStatus_Nav,Device_Nav/GoodsMovement_Nav,Device_Nav/DeviceLocation_Nav/FuncLocation_Nav/Address/AddressCommunication,ConnectionObject_Nav/FuncLocation_Nav/Address/AddressCommunication,Device_Nav/DeviceLocation_Nav/Premise_Nav,Workorder_Nav/OrderMobileStatus_Nav,Workorder_Nav/OrderISULinks,Device_Nav/MeterReadings_Nav").then(results => {
                if (results.length > 0) {
                    localBinding = results.getItem(0);
                    if (results.getItem(0).ISUProcess === "DISCONNECT") {
                        localBinding.DisconnectActivity_Nav = results.getItem(0).Workorder_Nav.DisconnectActivity_Nav[0];
                        localBinding.Device_Nav = results.getItem(0).Device_Nav;
                    }
                    if (meterLib.isProcessed(localBinding)) {
                        return Promise.resolve(true);
                    } else {
                        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [], "$filter=NotificationNumber eq '" + context.binding.WOHeader.NotificationNumber + "'&$expand=Activities,Items/ItemActivities").then(results => {
                            if (results && results.getItem.length > 0 && results.getItem(0).Activities.length > 0 && results.getItem(0).Activities[0].ActivityCatalogType.length > 0) {
                                return Promise.resolve(true);
                            } else {
                                return Promise.resolve(false);
                            }
                        });
                    }
                } else {
                    return Promise.resolve(false);
                }
            });
        } else {
            return Promise.resolve(true);
        }
    } else {
        return Promise.resolve(true);
    }
}
