/**
 * Функция обрабатывает переданную ей строку и возвращает ссылку
 * подходящую для вставки в HTML элемент a
 * 
 * @param {*} link 
 */
export default function(link) {
    if(~link.indexOf("http")) {
        return link;
    }
    if(~link.indexOf("@")) {
        return `mailto:${link}`;
    }
    return `http://${link}`;
};