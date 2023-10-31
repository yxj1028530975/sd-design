/**
 * 将style键值对转换为style字符串
 * @param styleObj
 */
export function stylesToString(styleObj: { [key: string]: string | number }): string {
    let styleStr = '';
    for (const style in styleObj) {
        if (styleObj[style] == undefined || styleObj[style] === '') continue;
        styleStr += `${style}: ${styleObj[style]};`;
    }
    return styleStr;
}

/**
 * 根据类名返回带前缀的类名
 * @param suffixCls 类名
 * @param customizePrefixCls  自定义类前缀名，此值会覆盖默认前缀
 */
export const getPrefixCls = (suffixCls: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) {
        return `${customizePrefixCls}-${suffixCls}`;
    }
    return `sd-${suffixCls}`;
};

/**
 * 给svg字符串添加属性
 * @param svgString svg字符串
 * @param attributes 属性键值对
 */
export const addSvgAttributes = (svgString: string, attributes: Record<string, any> = {}) => {
    if (!attributes.fill) {
        attributes['fill'] = 'currentcolor';
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = doc.documentElement as HTMLElement;
    Object.entries(attributes).forEach(([name, value]) => {
        svgElement.setAttribute(name, value);
    });
    return new XMLSerializer().serializeToString(doc);
};

export const getSDSVG = (svgString: string, attributes: Record<string, any> = {}) => {
    return `<span class="${getPrefixCls('icon')}">${addSvgAttributes(svgString, attributes)}</span>`
}
