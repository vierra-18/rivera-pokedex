// components/ui/BarChart.tsx
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

type BarChartProps = {
	stats: PokemonStat[];
	types: string[]; // Added types prop
};

const typeColors: Record<string, string> = {
	normal: "#a8a878",
	fire: "#f08030",
	fighting: "#c03028",
	water: "#6890f0",
	poison: "#a040a0",
	electric: "#2C2C2A",
	ground: "#e0c068",
	grass: "#78c850",
	flying: "#a890f0",
	ice: "#98d8d8",
	bug: "#a8b820",
	psychic: "#f85888",
	rock: "#b8a038",
	ghost: "#1D0249",
	dragon: "#7038f8",
	dark: "#302B28",
	steel: "#b8b8d0",
	fairy: "#ffb7fa",
};

const BarChart: React.FC<BarChartProps> = ({ stats, types }) => {
	const primaryType = types[0] || "normal";
	const chartColor = typeColors[primaryType] || typeColors.normal;

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
				backgroundColor: chartColor, // Use chartColor here
				categoryPercentage: 0,
				borderWidth: 1,
				barThickness: 40,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,

		scales: {
			x: {
				beginAtZero: true,
				max: 255,
				grid: {
					display: false,
				},
				ticks: {
					color: "#f8f8f8",
				},
			},
			y: {
				borderColor: "transparent",
				max: 255,
				grid: {
					display: false
				},
				ticks: {
					display: false,
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
		<div className="relative w-full  px-[3vw] flex justify-start">
			<Bar data={chartData} options={options as any} />
		</div>
	);
};

export default BarChart;
