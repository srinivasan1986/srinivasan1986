
export default function RefreshPage(clientAPI) {
    clientAPI.currentPage.redraw();
    if (clientAPI._control && clientAPI._control.getContainer() && clientAPI._control.getContainer()._tabPages &&
        clientAPI._control.getContainer()._tabPages.length >= 5) {
        clientAPI._control.getContainer()._tabPages[4].redraw();
    }
}
