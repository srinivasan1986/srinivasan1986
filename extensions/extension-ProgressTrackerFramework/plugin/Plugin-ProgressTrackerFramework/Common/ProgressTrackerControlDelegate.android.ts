declare var com;

@NativeClass()
@Interfaces([com.sap.sam.android.plugin.progresstracker.IProgressTrackerDelegate])
class ProgressTrackerControlDelegate extends java.lang.Object {
    
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
