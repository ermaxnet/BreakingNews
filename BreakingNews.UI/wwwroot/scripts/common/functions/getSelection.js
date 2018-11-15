/**
 * Вернуть выделенное используя стандартный функционал браузера
 * 
 * @param {*} node 
 */
export default function(node) {
    let text = null;
    if(node.getSelection) {
        text = node.getSelection();
    } else if(node.document.getSelection) {
        text = node.document.getSelection();
    } else if(node.document.selection) {
        text = node.document.selection.createRange().text;
    }
    return text;
};