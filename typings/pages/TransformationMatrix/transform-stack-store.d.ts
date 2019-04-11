import { mat2d } from 'gl-matrix';
import { DataTransformValue, DataTransformStack, DataTransformType } from '../../data';
export default class TransformStackStore {
    type: DataTransformType;
    value: DataTransformValue;
    active: boolean;
    constructor({ type, value, active }: DataTransformStack);
    readonly matrix: mat2d;
    readonly matrixInverse: mat2d | null;
}
