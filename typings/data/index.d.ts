declare type DataColorMode = 'hex' | 'hexa' | 'rgb' | 'rgba' | 'hsl' | 'hsl';
declare type DataColorElements = string | number[] | [string, number];
declare type DataColor = [DataColorMode, DataColorElements];
declare const DataColorInfo: {
    maxValue: {
        hex: number[];
        hexa: number[];
        rgb: number[];
        rgba: number[];
        hsl: number[];
        hsla: number[];
    };
    label: {
        hex: string[];
        hexa: string[];
        rgb: string[];
        rgba: string[];
        hsl: string[];
        hsla: string[];
    };
    unit: {
        hex: string[];
        hexa: string[];
        rgb: string[];
        rgba: string[];
        hsl: string[];
        hsla: string[];
    };
};
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
export { DataColorMode, DataColorElements, DataColor, DataColorInfo, DataTransform, DataTransformType, DataTransformValue, DataTransformType1DList, DataTransformType2DList, DataTransformTypeMatrixList, DataTransformTypeList, DataTransformStack };
