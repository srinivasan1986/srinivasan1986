/**
 * Checks if SoldToPartyLstPkr field is enabled or disabled.
 * @param {*} context 
 * @returns false if creating order from notification. True for everything else.
 */
export default function SoldToPartyLstPkrIsEditable(context) {
    //SoldToPartyLstPkr should be disabled if creating a service order from a notification
    let binding = context.getPageProxy().binding;
    return binding.FromNotification ? false : true;
}

