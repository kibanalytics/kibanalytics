import { getPrefixedAttributes } from './utils.client';

export default (element, className, prefix, type, value, trackEventFn) => () => {
    const classData = {
        name: className,
        prefix,
        type,
        value
    };

    const elementData = {
        tagName: element.tagName
    };

    const customData = getPrefixedAttributes('data-kbs-', element);

    const data = {
        class: classData,
        element: elementData,
        ...customData
    };

    const options = {
        sendBeacon: data.element.tagName === 'A'
    };
    return trackEventFn(type, data, options);
}