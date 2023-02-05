import NativeScriptObject from '../Common/Library/NativeScriptObject';

export default function MarkerSize(context) {
    let priority = context.binding.Priority;
    if (priority === '1' || priority === '2') {
        if (NativeScriptObject.getNativeScriptObject(context).platformModule.isAndroid) {
            return 32;
        } else {
            return 33; 
        }
    }
    if (NativeScriptObject.getNativeScriptObject(context).platformModule.isAndroid) {
        return 32;
    } else {
        return 28;
    }
}
