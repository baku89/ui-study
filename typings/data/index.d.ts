declare type DataColorMode = 'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'hsv' | 'hsva';
declare type DataColorElements = string | number[] | [string, number];
declare type DataColor = [DataColorMode, DataColorElements];
interface DataColorModeInfo {
    max: number[];
    label: string[];
    unit: string[];
}
declare const DataColorInfo: Map<DataColorMode, DataColorModeInfo>;
declare type DataTransformType1D = 'translateX' | 'translateY' | 'scaleX' | 'scaleY' | 'scaleUniform' | 'rotate' | 'skewX' | 'skewY';
declare type DataTransformType2D = 'translate' | 'scale' | 'skew';
declare type DataTransformTypeMatrix = 'matrix';
declare type DataTransformType = DataTransformType1D | DataTransformType2D | DataTransformTypeMatrix;
declare type DataTransformValue = number | number[];
declare const DataTransformType1DList: string[];
declare const DataTransformType2DList: string[];
declare const DataTransformTypeMatrixList: string[];
declare const DataTransformTypeList: string[];
interface DataTransformStack {
    type: DataTransformType;
    value: DataTransformValue;
    active: boolean;
}
declare type DataTransform = DataTransformStack[];
export { DataColorMode, DataColorElements, DataColor, DataColorModeInfo, DataColorInfo, DataTransform, DataTransformType, DataTransformValue, DataTransformType1DList, DataTransformType2DList, DataTransformTypeMatrixList, DataTransformTypeList, DataTransformStack };
