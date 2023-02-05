import libCommon from '../../Common/Library/CommonLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PartnerDisplayValue(context) {
	let displayValue = '';
	let returnValue = '';
	let type =  libCommon.getStateVariable(context,'partnerType1');

	switch (type) {
		case 'SP':
			displayValue = 'Name1';
			returnValue = 'Customer';
			break;
		case 'VN':
			displayValue = 'Name1';
			returnValue = 'Vendor';
			break;
		case 'AO':
		case 'KU':
		case 'VU':
			displayValue = 'UserName';
			returnValue = 'UserId';
			break;
		case 'VW':
			displayValue = 'EmployeeName';
			returnValue = 'PersonnelNumber';
			break;
		default:
			return '';
	}

	return `${context.binding[displayValue]} - ${context.binding[returnValue]}`;
}
