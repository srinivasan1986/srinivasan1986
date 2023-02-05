import libCommon from '../../Common/Library/CommonLibrary';
export default function PartnerReturnValue(context) {
	let returnValue = '';
	let type =  libCommon.getStateVariable(context,'partnerType2');
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
