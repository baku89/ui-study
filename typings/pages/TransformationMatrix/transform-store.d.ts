import { mat2d, vec2 } from 'gl-matrix';
import TransformStackStore from './transform-stack-store';
import { DataTransformValue, DataTransformType, DataTransform } from '../../data';
export default class TransformStore {
    transform: TransformStackStore[];
    constructor(transform: DataTransform);
    readonly svgTransform: string;
    readonly matrix: mat2d;
    readonly activeScaleMatrix: mat2d | null;
    readonly activeScaleMatrixInverse: mat2d | null;
    readonly svgTransformActiveScale: string;
    readonly activeScaleIndex: number;
    readonly bboxTranslateActive: boolean;
    readonly bboxScaleActive: boolean;
    readonly bboxRotateActive: boolean;
    readonly matrixInverse: mat2d | null;
    setValue({ index, value }: {
        index: number;
        value: DataTransformValue;
    }): void;
    setTransform(payload: {
        transform: DataTransform;
    }): void;
    removeStack({ index }: {
        index: number;
    }): void;
    addStack({ type }: {
        type: DataTransformType;
    }): void;
    toggleActive({ index }: {
        index: number;
    }): void;
    calcBackTransform({ destination, type }: {
        destination: mat2d;
        type: 'translate' | 'scale' | 'rotate';
    }): void;
    setScale(scale: vec2): void;
}
