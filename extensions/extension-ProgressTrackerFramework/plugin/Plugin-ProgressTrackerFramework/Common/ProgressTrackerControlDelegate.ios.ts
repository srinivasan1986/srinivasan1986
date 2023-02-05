interface ProgressTrackerDelegate extends NSObjectProtocol { // tslint:disable-line
    onCreate?(): void;
    onStepSelected?(selectedStep: string): void;
}

declare var ProgressTrackerDelegate: {
    prototype: ProgressTrackerDelegate;
};

@NativeClass()
class ProgressTrackerControlDelegate extends NSObject implements ProgressTrackerDelegate  {

    public static ObjCProtocols = [ProgressTrackerDelegate]; // tslint:disable-line
    
    public static initWithDataServiceAndBridge(dataService, bridge, controlExtension): ProgressTrackerControlDelegate {
        let controlDelegate = <ProgressTrackerControlDelegate> ProgressTrackerControlDelegate.new();
        controlDelegate._dataService = dataService;
        controlDelegate._bridge = bridge;
        controlDelegate._controlExtension = controlExtension;
        return controlDelegate;
    }

    private _dataService: any;
    private _bridge: any;
    private _controlExtension: any;

    /**
     * Explicitly set reference to control extension
     * @param controlExtension
     */
    public setControlExtension(controlExtension) {
        this._controlExtension = controlExtension;
    }

    public onCreate() {
        this._controlExtension.onCreate();
    }

    public onStepSelected(selectedStep) {
        this._controlExtension.onStepSelected(selectedStep);
    }
}

export { ProgressTrackerControlDelegate }
