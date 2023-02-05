declare var ProgressTrackerBridge: any;

import {ProgressTrackerControlDelegate} from '../Common/ProgressTrackerControlDelegate';

export class ProgressTrackerControl {

    private _params: any;
    private _delegate: any;

    public create(params, dataService, extension):any {
        let bridge = ProgressTrackerBridge.new();
        extension._bridge = bridge;
        this._delegate = ProgressTrackerControlDelegate.initWithDataServiceAndBridge(dataService, bridge, extension);
        extension._delegate = this._delegate;
        return bridge.createWithDelegate(this._delegate);
    }
    public getDelegate(): any {
        return this._delegate;
    }

    public setDelegate(delegate) {
        this._delegate = delegate;
    }
};
