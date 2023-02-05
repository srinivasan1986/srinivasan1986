import { NoteLibrary as NoteLib} from './NoteLibrary';

export default function NotesViewNav(clientAPI) {
    
    // Set the transaction type before navigating to the Note View page
    let page = clientAPI.getPageProxy()._page._definition.getName();
    if (NoteLib.didSetNoteTypeTransactionFlagForPage(clientAPI, page)) {
        return clientAPI.executeAction('/SAPAssetManager/Actions/Notes/NoteViewNav.action');
    }
    return null;
}

// NAVIGATION FOR PRT NOTES (MOVED TO 2210)
// export default function PRTNotesNav(clientAPI) {
    
//     // Set the transaction type before navigating to the Note View page
//     const editable = PRTNotesVisible(clientAPI);
//     if (editable) {
//         const page = clientAPI.getPageProxy()._page._definition.getName();
//         const binding = clientAPI.getPageProxy().binding.Tools[0];
        
//         clientAPI.getPageProxy().setActionBinding(binding);

//         if (NoteLib.didSetNoteTypeTransactionFlagForPage(clientAPI, page)) {
//             return clientAPI.executeAction('/SAPAssetManager/Actions/Notes/NoteViewNav.action');
//         }
//     } else {
//         return null;
//     }
    
// }

// export default function PRTNotesVisible(context) {
//     if (context.binding.Tools[0]) {
//         return true;
//     } else {
//         return false;
//     }
// }
