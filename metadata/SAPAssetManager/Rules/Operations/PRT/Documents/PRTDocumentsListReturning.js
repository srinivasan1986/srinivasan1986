export default function PRTDocumentsListReturning(pageProxy) {
    let sectionedTableProxy = pageProxy.getControls()[0];
    sectionedTableProxy.redraw();
    // Reset the binding in order not to break other rules and flow that are not connected with notes
    pageProxy._context.binding = pageProxy.evaluateTargetPathForAPI('#Page:-Previous').binding;
}
