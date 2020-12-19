export interface IntervalCallback {
    name: string;
    interval: number;
    callback: () => void;
    timeToNextInterval: number;
}
