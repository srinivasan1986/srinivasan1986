import libCommon from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PartnerReturnValue(context) {
	let returnValue = '';
	let type = libCommon.getStateVariable(context,'partnerType1');
	

	switch (type) {
		case 'SP':
			returnValue = 'Customer';
			break;
		case 'VN':
			returnValue = 'Vendor';
			break;
		case 'AO':
		case 'KU':
		case 'VU':
			returnValue = 'UserId';
			break;
		case 'VW':
			returnValue = 'PersonnelNumber';
			break;
		default:
			return '';
	}

	return context.binding[returnValue];

}
