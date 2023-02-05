import IsServiceReportEnabled from './IsServiceReportEnabled';
import PDFGenerate from './PDFGenerate';

export default function PDFGenerateDuringCompletion(context) {
    if (IsServiceReportEnabled(context)) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties':
            {
                'Title': '$(L, confirm_status_change)',
                'Message': '$(L,generate_service_report_warning)',
                'OKCaption': '$(L,ok)',
                'CancelCaption': '$(L,cancel)',
            },
        }).then(actionResult => {
            if (actionResult.data === true) {
                return PDFGenerate(context);
            } else {
                return Promise.resolve();
            }
        });
    } else {
        return Promise.resolve();
    }
    
}
