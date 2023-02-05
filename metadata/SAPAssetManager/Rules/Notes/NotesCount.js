import { NoteLibrary as NoteLib} from './NoteLibrary';
import LibVal from '../Common/Library/ValidationLibrary';

export default function NotesCount(context) {
    
    let page = context.getPageProxy()._page._definition.getName();
    let query = '';
    // The binding object on the PRTListViewPage is the same as Operation Details so we have to add this check
    // MOVED TO 2210
    // if (page === 'PRTListViewPage') {
    //     if (context.binding.Tools[0]) {
    //         query = context.binding.Tools[0]['@odata.readLink'];
    //     } else return 0;
    // } else {
        query = context.getPageProxy().binding['@odata.readLink'];
    // }
    let noteComponent = NoteLib.getNoteComponentForPage(context, page);
    if (noteComponent) {

        return context.read('/SAPAssetManager/Services/AssetManager.service', query + '/' + noteComponent, [], '').then((result) => {
            if (result && result.getItem(0)) {
                if (LibVal.evalIsEmpty(result.getItem(0).TextString)) {
                    return 0;
                }
                return 1;
            }
            return 0;
        }).catch(() => {
            return 0;
        });
    } 
    return 0;
}
