/**
 * Возвращает результат функции getBoundingClientRect на текущем селекте
 * в редакторе
 * 
 * @param {*} node 
 */
export default function(node) {
    const innerRect = node.getRangeAt(0).getBoundingClientRect();
    let rect = (innerRect && innerRect.top)
        ? innerRect 
        : node.getRangeAt(0).getClientRects()[0];
    if(!rect) {
        if(node.anchorNode && node.anchorNode.getBoundingClientRect) {
            rect = node.anchorNode.getBoundingClientRect();
            rect.isEmptyline = true;
        } else {
            rect = null;
        }
    }
    return rect;
};