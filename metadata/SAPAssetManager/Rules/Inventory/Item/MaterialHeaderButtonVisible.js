export default function MaterialHeaderButtonVisible(context) {
    return context.binding['@odata.type'].includes('MaterialDocItem');
}
