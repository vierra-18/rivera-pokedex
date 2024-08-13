import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
	ChartDataLabels
);

type PokemonStat = {
	stat: {
		name: string;
	};
	base_stat: number;
};

type HorizontalBarChartProps = {
	stats: PokemonStat[];
};

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ stats }) => {
	const chartData = {
		labels: stats.map((stat) =>
			stat.stat.name
				.toString()
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")
		),
		datasets: [
			{
				axis: "y",
				label: "Base Stats",
				data: stats.map((stat) => stat.base_stat),
				backgroundColor: "rgba(54, 162, 235, 1)",
				borderColor: "rgba(54, 162, 235, 1)",
				borderWidth: 1,
				borderRadius: 5,
				barThickness: 5,
			},
		],
	};

	const options = {
		responsive: true,
		indexAxis: "y",
		maintainAspectRatio: false,
		scales: {
			x: {
				beginAtZero: true,
				max: 255,
				grid: {
					display: false,
				},
			},
			y: {
				ticks: {
					font: {
						weight: "bold", // Make y-axis labels bold
					},
					color: "#f8f8f8", // Optional: specify color if needed
				},
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				callbacks: {
					label: (context: any) => ` ${context.raw}`,
				},
			},
			datalabels: {
				anchor: "end",
				align: "end",
				formatter: (value: number) => value.toString(),
				color: "#f8f8f8", // Color of the label
				font: {
					weight: "bold",
				},
			},
		},
	};

	return (
		<div style={{ position: "relative", width: "100%", height: "200px" }}>
			<Bar data={chartData} options={options as any} />
		</div>
	);
};

export default HorizontalBarChart;
