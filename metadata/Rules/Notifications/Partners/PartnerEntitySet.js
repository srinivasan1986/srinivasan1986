import libCommon from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function PartnerEntitySet(context) {
	let entitySet = '';
	let type = libCommon.getStateVariable(context,'partnerType1');

	switch (type) {
		case 'SP':
			entitySet = 'Customers';
			break;
		case 'VN':
			entitySet = 'Vendors';
			break;
		case 'AO':
		case 'KU':
		case 'VU':
			entitySet = 'SAPUsers';
			break;
		case 'VW':
			entitySet = 'Employees';
			break;
		default:
			return entitySet;
	}
	return entitySet;
}
