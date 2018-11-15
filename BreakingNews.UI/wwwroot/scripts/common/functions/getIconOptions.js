/**
 * Возвращает параметры для иконки кнопки в Toolbar
 * 
 * @param {*} param0 
 */
export default function({ icon, label = null }) {
    const iconLabel = {};
    label
        ? (
            iconLabel.label = label
        )
        : (
            iconLabel.icon = icon
        );
    return iconLabel;
};