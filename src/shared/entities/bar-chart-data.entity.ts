export class BarChartData {
    labels: string[];
    datasets: ChartData[];
    title: string;
}
export class ChartData {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
}
export class ChartDataSimple {
    label: string;
    data: number;
    backgroundColor: string;
    borderColor: string;
}

export const requestcolor: string = "#4472C4";
export const requestBordercolor: string = "#CCCC00";