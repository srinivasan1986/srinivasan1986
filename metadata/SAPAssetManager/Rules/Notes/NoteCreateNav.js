import ComLib from '../Common/Library/CommonLibrary';

import { NoteLibrary as NoteLib} from './NoteLibrary';

export default function NoteCreateNav(clientAPI) {
    
    //Set the global TransactionType variable to CREATE
    ComLib.setOnCreateUpdateFlag(clientAPI, 'CREATE');

    //set the CHANGSET flag to false
    ComLib.setOnChangesetFlag(clientAPI, false);

    // Only expect this to be true when setting from a details page
    if (NoteLib.didSetNoteTypeTransactionForBindingType(clientAPI)) {
    
        return NoteLib.noteDownload(clientAPI).then(() => {
            return clientAPI.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateNav.action');
        });
    }
    // else throw an error?
}


// ADD NAVIGATION FOR PRT NOTES (MOVED TO 2210)
// export default function PRTNotesAdd(clientAPI) {
//     //Set the global TransactionType variable to CREATE
//     ComLib.setOnCreateUpdateFlag(clientAPI, 'CREATE');

//     //set the CHANGSET flag to false
//     ComLib.setOnChangesetFlag(clientAPI, false);

//     clientAPI._context.binding = clientAPI.getPageProxy().binding.Tools[0];
//     // Only expect this to be true when setting from a details page
//     if (NoteLib.didSetNoteTypeTransactionForBindingType(clientAPI)) {
//         return NoteLib.noteDownload(clientAPI).then(() => {
//             return clientAPI.executeAction('/SAPAssetManager/Actions/Notes/NoteCreateNav.action');
//         });
//     }
//     // else throw an error?
// }
