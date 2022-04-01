const isIos = (platform) => {
    return /iPhone|iPad|iPod/.test(platform);
};
module.exports.isIos = isIos;

const isAndroid = (userAgent) => {
    return /Android/.test(userAgent);
};
module.exports.isAndroid = isAndroid;

const isBlackBerry = (platform) => {
    return /BlackBerry/.test(platform);
};
module.exports.isBlackBerry = isBlackBerry;

const isMac = (platform) => {
    return /Mac/.test(platform);
};
module.exports.isMac = isMac;

const isWindows = (platform) => {
    return /Win/.test(platform);
};
module.exports.isWindows = isWindows;

const isLinux = (platform) => {
    return /Linux/.test(platform) && !isAndroid();
};
module.exports.isLinux = isLinux;

const detectOs = (userAgent, platform) => {
    if (isIos()) return 'iOS';
    if (isAndroid()) return 'Android';
    if (isBlackBerry()) return 'BlackBerry';
    if (isMac()) return 'Mac';
    if (isWindows()) return 'Windows';
    if (isLinux()) return 'Linux';
    return 'Unknown';
};
module.exports.detectOs = detectOs;