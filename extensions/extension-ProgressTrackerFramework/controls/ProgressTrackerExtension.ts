import { BaseExtension } from './BaseExtension';
import { ProgressTrackerControl} from 'extension-ProgressTrackerFramework';
import { ValueResolver} from 'mdk-core/utils/ValueResolver';

export class ProgressTrackerExtension extends BaseExtension {
    protected _delegate: any;
    protected _steps: any;
    protected _currSelectionIndex: any;
    protected _prevSelectionIndex: any;

    public initialize(props) {
        super.initialize(props);
        let pc: ProgressTrackerControl = new ProgressTrackerControl();
        let vc = pc.create(undefined, this.getDataService(), this);
        this._delegate = pc.getDelegate();
        this.setViewController(vc);
    }

    get isBindable(): boolean {
        return true;
    }

    public bind(): Promise<any> {
        return this.observable().bindValue(this.definition().getValue());
    }

    public onCreate() {
        this._currSelectionIndex = 0;
        this._prevSelectionIndex = 0;
        this._steps = {};
        let config = this.getParams().Config;
        if (config) {
            ValueResolver.resolveKeyValues(config, this.context).then((result) => {
                this._bridge.updateConfig(JSON.stringify({'Config': result}));
                let callback = this.getParams().InitialSteps;
                if (callback) {
                    this.executeActionOrRule(callback, this.context).then(stepsInfo => {
                        this._steps = stepsInfo.Steps;
                        this._currSelectionIndex = stepsInfo.SelectedStepIndex;
                        this._bridge.updateAllSteps(JSON.stringify(stepsInfo));
                    });
                }
            });
        }
    }

    public onStepSelected(selectedStep) {
        const selectionIndex = JSON.parse(selectedStep).StepIndex;
        if (selectionIndex !== this._currSelectionIndex) {
            this._prevSelectionIndex = this._currSelectionIndex;
            this._currSelectionIndex = selectionIndex;
            let callback = this.getParams().OnStepSelected;
            if (callback) {
                this.executeActionOrRule(callback, this.context);
            }
        }
    }

    public onDataChanged(action: any, result: any) {
        let callback = this.getParams().OnDataChanged;
        if (callback) {
            this.executeActionOrRule(callback, this.context);
        }
    }

    public onPageUnloaded(pageExists: boolean) {
        if (!pageExists) {
            this._bridge.dispose();
            this._delegate.setControlExtension(undefined);
            this._delegate = undefined;
            this.setViewController(undefined);
            this._bridge = undefined;
        }
    }

    public getAllSteps() {
        return this._steps;
    }

    public getStep(stepIndex) {
        return this._steps[stepIndex];
    }

    public getNumberOfSteps() {
        return this._steps.length;
    }

    public getCurrSelection() {
        return this._currSelectionIndex;
    }

    public getPrevSelection() {
        return this._prevSelectionIndex;
    }

    public updateAllSteps(steps, selectedStepIndex) {
        this._steps = steps;
        this._currSelectionIndex = selectedStepIndex;
        return this._bridge.updateAllSteps(JSON.stringify({
            SelectedStepIndex: selectedStepIndex,
            Steps: steps,
        }));
    }

    public updateStep(step, stepIndex) {
        this._steps[stepIndex] = step;
        return this._bridge.updateStep(JSON.stringify({
            StepIndex: stepIndex,
            Step: step,
        }));
    }

    public setSelection(stepIndex) {
        if (this._bridge.setSelection(stepIndex)) {
            this._prevSelectionIndex = this._currSelectionIndex;
            this._currSelectionIndex = stepIndex;
            return true;
        }
        return false;
    }

    public addStep(step, stepIndex) {
        if (this._bridge.updateStep(JSON.stringify({
            StepIndex: stepIndex,
            Step: step,
        }))) {
            this._steps.splice(stepIndex, 0, step);
            return true;
        }
        return false;
    }

    public removeStep(stepIndex) {
        if (this._bridge.removeStep(stepIndex)) {
            this._steps.splice(stepIndex, 1);
            return true;
        }
        return false;
    }

    public focusOnStep(stepIndex) {
        return this._bridge.focusOnStep(stepIndex);
    }

    public reset() {
        this.onCreate();
    }
}

