export class ProgressTrackerControlDelegate {

    public static initWithDataServiceAndBridge(dataService, bridge, controlExtension): ProgressTrackerControlDelegate {
        let controlDelegate = new ProgressTrackerControlDelegate();
        controlDelegate._dataService = dataService;
        controlDelegate._bridge = bridge;
        controlDelegate._controlExtension = controlExtension;
        return controlDelegate;
    }

    private _dataService: any;
    private _bridge: any;
    private _controlExtension: any;

    public onCreate() {
        // intentional no-op
    }

    public onStepSelected(selectedStep) {
        // intentional no-op
    }
}
