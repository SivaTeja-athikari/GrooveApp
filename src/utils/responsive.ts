import { Dimensions, PixelRatio } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isLargeDevice = DeviceInfo?.isTablet() ? true : width >= 768;

const scaleBase = isLargeDevice ? 1024 : 375;
const maxWidth = isLargeDevice ? width * 0.7 : width;
const scalingValue = width > height ? height : width
const scale = scalingValue / scaleBase;

const scaleFont = (size: number): number => {
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const scaleSize = (size: number): number => {
    return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

const scalePadding = scaleSize;
const scaleSizeMultiplied = (size: number): number => {
    const multiplier = isLargeDevice ? 1.5 : 1;
    const scaled = size * scale * multiplier;
    return Math.round(PixelRatio.roundToNearestPixel(scaled));
};
const scalePaddingMultiplied = scaleSizeMultiplied

const scaleHeight = (size: number): number => {
    const heightScale = height / 667;
    return Math.round(size * heightScale);
};

const scaleWidth = (size: number): number => {
    return Math.round(size * scale);
};

const getNotchHeight = () => {
    const { top } = useSafeAreaInsets();
    return top;
};

const getDeviceType = () => {
    if (isSmallDevice) return 'small';
    if (isMediumDevice) return 'medium';
    return 'large';
};

const isPortrait = height > width;
const isLandscape = width > height;

const getAspectRatio = () => {
    return width / height;
};

export {
    width,
    height,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    scaleFont,
    scaleSize,
    scalePadding,
    scaleHeight,
    scaleWidth,
    getDeviceType,
    isPortrait,
    isLandscape,
    getAspectRatio,
    getNotchHeight,
    maxWidth,
    scaleSizeMultiplied,
    scalePaddingMultiplied
};
export const useSafeAreaPadding = () => {
    const insets = useSafeAreaInsets();
    return {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
    };
};