import GenerateLocalConfirmationNum from '../../Confirmations/CreateUpdate/OnCommit/GenerateLocalConfirmationNum';
import { TransactionNoteType } from '../../Notes/NoteLibrary';
import { NoteLibrary } from '../../Notes/NoteLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import libOprMobile from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import IsOnCreate from '../../Common/IsOnCreate';
import Logger from '../../Log/Logger';
import PDFGenerateDuringCompletion from '../../PDF/PDFGenerateDuringCompletion';

export default function MileageAddEditOnCommit(pageProxy) {

    try {
        if (IsOnCreate(pageProxy)) {
            
            return GenerateLocalConfirmationNum(pageProxy).then(confirmationNum => { //Generate a new confirmation number and store it
                pageProxy.getClientData().localConfirmationNum = confirmationNum;
                CommonLibrary.setStateVariable(pageProxy, 'ObjectCreatedName', 'Mileage');
                
                return pageProxy.executeAction('/SAPAssetManager/Actions/ServiceOrders/Mileage/MileageAdd.action').then(() => { //Create the Mileage Confirmation
                    if (CommonLibrary.getStateVariable(pageProxy, 'IsOperationCompletion')) {
                        CommonLibrary.setStateVariable(pageProxy, 'IsOperationCompletion', false);
                        return libOprMobile.createBlankConfirmation(pageProxy, 1).then(() => {
                            return createNoteIfDefined(pageProxy);                 
                        });
                    } else {
                        return createNoteIfDefined(pageProxy);
                    }
                }).finally(() => {
                    return pageProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                        if (CommonLibrary.getStateVariable(pageProxy, 'IsPDFGenerate')) {
                            return PDFGenerateDuringCompletion(pageProxy).then(() => {
                                CommonLibrary.setStateVariable(pageProxy, 'IsPDFGenerate', false);
                                CommonLibrary.setStateVariable(pageProxy, 'IsWOCompletion', false);
                                return Promise.resolve();
                            });
                        }
                        return Promise.resolve();
                    });
                });
            });

        } else {
            return pageProxy.executeAction('/SAPAssetManager/Actions/ServiceOrders/Mileage/MileageEdit.action').then(() => {
                return editNoteIfDefined(pageProxy).then(() => {
                    return pageProxy.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntitySuccessMessage.action');
                }); 
            });
        }
    } catch (error) {
        Logger.error(pageProxy.getGloalDefinition('/SAPAssetManager/Globals/Mileage/MileageGroup.global').getValue(), error);
    }
    
}

function createNoteIfDefined(pageProxy) {
    let note = CommonLibrary.getFieldValue(pageProxy, 'DescriptionNote', '', null, true);
                    
    if (note) {
        NoteLibrary.setNoteTypeTransactionFlag(pageProxy, TransactionNoteType.mileage());
        CommonLibrary.incrementChangeSetActionCounter(pageProxy);
        return pageProxy.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateDuringConfirmationCreate.action');
    } else {
        return Promise.resolve();
    }
}

function editNoteIfDefined(pageProxy) {
    let note = CommonLibrary.getFieldValue(pageProxy, 'DescriptionNote', '', null, true);
                    
    if (note) {
        NoteLibrary.setNoteTypeTransactionFlag(pageProxy, TransactionNoteType.mileage());
        return pageProxy.executeAction('/SAPAssetManager/Actions/Notes/NoteUpdateDuringConfirmationUpdate.action');
    } else {
        return Promise.resolve();
    }
}
