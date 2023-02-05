import common from '../Common/Library/CommonLibrary';
import OdataOffset from '../Common/Date/OffsetODataDate';
import ODataDate from '../Common/Date/ODataDate';
export default function Timeline(context) {
    let statuses = [];
    let queryOptions = '';
    let timestamp = new Date();
    ///Get timeline statuses, nav links and query options to build the timeline 
    let entityset = common.getEntitySetName(context);
    switch (entityset) {
        case 'MyWorkOrderHeaders':
            ///Get timeline statuses from app params 
            statuses = common.getWOTimelineStatuses(context);
            queryOptions = "$filter=ObjectType eq 'WORKORDER'";
            entityset =`${context.getPageProxy().binding['@odata.readLink']}/OrderMobileStatus_Nav`;
            break;
        case 'MyWorkOrderOperations':
            ///Get timeline statuses from app params 
            statuses = common.getOperationsTimelineStatuses(context);
            queryOptions = "$filter=ObjectType eq 'WO_OPERATION'";
            entityset =`${context.getPageProxy().binding['@odata.readLink']}/OperationMobileStatus_Nav`;
            break;
        case 'MyWorkOrderSubOperations':
            ///Get timeline statuses from app params 
            statuses = common.getOperationsTimelineStatuses(context);
            queryOptions = "$filter=ObjectType eq 'WO_OPERATION'";
            entityset =`${context.getPageProxy().binding['@odata.readLink']}/SubOpMobileStatus_Nav`;
            break;
        default:
            queryOptions = '';
            entityset = 'PMMobileStatuses';
            break;
    }
   const STARTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
   const HOLD = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
   const TRANSFER = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
   const RECEIVED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
   let data = [];
   ///Get the operation current status
   return context.read('/SAPAssetManager/Services/AssetManager.service', entityset, [], '$expand=OverallStatusCfg_Nav,PMMobileStatusHistory_Nav').then(function(currentStatus) {
       ///translationKeys contains the all the translatable keys for the operation statuses
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], queryOptions).then((translationKeys) => {
           let timelineIndex = 0;
           statuses.forEach((status, key)=> {
                ////If there is a match between current status and a status on the list get the timeline index
                if (currentStatus.getItem(0).OverallStatusCfg_Nav.MobileStatus === status) {
                  timelineIndex = key;
               } 
           });
           if (currentStatus.getItem(0).OverallStatusCfg_Nav.MobileStatus === RECEIVED) {
               timelineIndex = 0;
           }
           ///If current status is (hold,transfer) Set timeline back to status before started
           if (currentStatus.getItem(0).OverallStatusCfg_Nav.MobileStatus === HOLD || currentStatus.getItem(0).OverallStatusCfg_Nav.MobileStatus === TRANSFER) {
                timelineIndex = (statuses.indexOf(STARTED) > 0) ? statuses.indexOf(STARTED) - 1 : timelineIndex;
            }
           ///If current status is hold set timeline back to status before started but only for operations and suboperations
           if (currentStatus.getItem(0).OverallStatusCfg_Nav.MobileStatus === HOLD && entityset !== 'MyWorkOrderHeaders') {
                 timelineIndex  = (statuses.indexOf(STARTED) > 0) ? statuses.indexOf(STARTED) - 1 : timelineIndex;
            }

            statuses.forEach((status, key)=> {
                ////Status key is not part of the set of expected statuses
                if (translationKeys.findIndex(x => x.MobileStatus === status)<0) {
                    data.push({
                        'Headline': context.localizeText(status),   
                        'Timestamp': '', 
                        'State': 'Open',
                        
                    });
                } else if (currentStatus.getItem(0).OverallStatusCfg_Nav.MobileStatus === status) {
                        ////Status key is current status
                        timestamp = new OdataOffset(context, currentStatus.getItem(0).EffectiveTimestamp);
                        data.push({
                            'Headline': context.localizeText(translationKeys.getItem(translationKeys.findIndex(x => x.MobileStatus === status)).OverallStatusLabel),
                            'Timestamp': timestamp.date().toISOString().substr(0, 19),
                            'State': 'Complete',
                            
                            });
                } else if (timelineIndex>0 && timelineIndex <= (statuses.length -1) && key <= timelineIndex) {
                    ///status key is a previous status on the timeline and it's on the histories
                     if (currentStatus.getItem(0).PMMobileStatusHistory_Nav.findIndex(x => x.MobileStatus === status) >= 0) {
                        timestamp = new OdataOffset(context, currentStatus.getItem(0).PMMobileStatusHistory_Nav[currentStatus.getItem(0).PMMobileStatusHistory_Nav.findIndex(x => x.MobileStatus === status)].EffectiveTimestamp);
                        data.push({
                            'Headline': context.localizeText(translationKeys.getItem(translationKeys.findIndex(x => x.MobileStatus === status)).OverallStatusLabel),
                            'Timestamp': timestamp.date().toISOString().substr(0, 19),                        
                            'State': 'Complete',
                            });
                     }
                } else {
                    // Add current timestamp to future statuses
                        timestamp = new ODataDate();
                        data.push({
                            'Headline': context.localizeText(translationKeys.getItem(translationKeys.findIndex(x => x.MobileStatus === status)).OverallStatusLabel),
                            'Timestamp': timestamp.date().toISOString().substr(0, 19), 
                            'State': 'Open', 
                        });
                    }
   
           });    
           return data;
        });

    });
    
}
