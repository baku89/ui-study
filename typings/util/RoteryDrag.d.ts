export default class RoteryDrag {
    minDistance: number;
    initialAngle: number;
    private baseRotation;
    private lastAngle;
    private prev;
    private current;
    private center;
    start(initialAngle: number, center: number[], position: number[]): void;
    getAngle(position: number[]): number;
    readonly radius: number;
}
