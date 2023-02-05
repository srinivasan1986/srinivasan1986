import libForm from '../../../Common/Library/FormatLibrary';

export default function RouteListStopCountCaption(context) {
    let binding = context.binding;
    let count = (binding.Stops === undefined) ? 0 : binding.Stops.length;
    return libForm.formatRouteListStopCount(context, count);
}
