import {ProgressTrackerControlDelegate} from '../Common/ProgressTrackerControlDelegate';
import { View } from '@nativescript/core';
declare var com;

export class ProgressTrackerControl extends View {

    public nativeView: any;
    private _params: any;
    private _delegate: any;
    private _dataService: any;
    private _progressTrackerManager: any;
    private _progressTrackerExtension: any;

    public createNativeView(): Object {
        try {
            this._delegate = ProgressTrackerControlDelegate.initWithDataServiceAndBridge(
                this._dataService, this._progressTrackerManager, this._progressTrackerExtension);
                this._progressTrackerExtension._delegate = this._delegate;
                return this._progressTrackerManager.createProgressTrackerView(
                    this._context, JSON.stringify(this._params), this._delegate, this.parent.android);
            } catch (error) {
                console.log(error);
            }
        }

    public initNativeView(): void {
        if (this.nativeView) {
            (<any> this.nativeView).owner = this;
        }
        super.initNativeView();
    }

    public disposeNativeView(): void {
        if (this.nativeView) {
            // Remove reference from native view to this instance.
            (<any> this.nativeView).owner = null;
        }

        // If you want to recycle nativeView and have modified the nativeView 
        // without using Property or CssProperty (e.g. outside our property system - 'setNative' callbacks)
        // you have to reset it to its initial state here.
        super.disposeNativeView();
    }

    public create(params, dataService, progressTrackerExtension): any {
        let progressTrackerManager = new com.sap.sam.android.plugin.progresstracker.ProgressTrackerManager();
        progressTrackerExtension._bridge = progressTrackerManager;

        if (progressTrackerExtension.androidContext() == null) { // ProgressTracker used as a ExtensionControl
            this._params = params;
            this._dataService = dataService;
            this._progressTrackerExtension = progressTrackerExtension;
            this._progressTrackerManager = progressTrackerManager;
            return this;
        } else { // ProgressTracker used as a SectionExtension
            this._delegate = ProgressTrackerControlDelegate.initWithDataServiceAndBridge(
                dataService, progressTrackerManager, progressTrackerExtension);
                progressTrackerExtension._delegate = this._delegate;
            return progressTrackerManager.createProgressTrackerView(
                progressTrackerExtension.androidContext(), JSON.stringify(params), this._delegate, null);
        }
    }

    public getDelegate(): any {
        return this._delegate;
    }
};
