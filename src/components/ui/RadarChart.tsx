// components/ui/RadarChart.tsx
import { Radar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import the data labels plugin
import { color } from "chart.js/helpers";

ChartJS.register(
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
	ChartDataLabels // Register the data labels plugin
);

type RadarChartProps = {
	stats: { stat: { name: string }; base_stat: number }[];
	types: string[]; // Adjusted to string[] to match the expected type
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

const RadarChart: React.FC<RadarChartProps> = ({ stats, types }) => {
	const primaryType = types[0] || "normal";
	const chartColor = typeColors[primaryType] || typeColors.normal;

	const data = {
		labels: stats.map((stat) => {
			let name = stat.stat.name.toString();

			// Modify names for special cases
			if (name === "special-defense") return "Sp. Def";
			if (name === "special-attack") return "Sp. Atk";

			// Capitalize other names normally
			return name
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");
		}),
		datasets: [
			{
				label: "Base Stat",
				data: stats.map((stat) => stat.base_stat),
				pointBackgroundColor: chartColor,
				pointBorderColor: chartColor,
				backgroundColor: `${chartColor}40`, // Semi-transparent background color
				borderColor: chartColor,
				borderWidth: 1,
			},
		],
	};

	const options = {
		responsive: true, // Make the chart responsive
		maintainAspectRatio: true, // Allow the chart to adapt to the container size
		scales: {
			r: {
				suggestedMin: 0,
				suggestedMax: 270,
				ticks: {
					beginAtZero: true,
					display: false,
					max: 255,
				},
				pointLabels: {
					font: {
						color: "#fff",
						size: 20, // Font size for point labels
						weight: "bold", // Font weight for point labels
					},
					color: "#fff",
				},
				grid: {
					color: "#EEEEEE33", // Color of grid lines with transparency
					lineWidth: 1, // Thickness of grid lines
				},
				angleLines: {
					color: "#EEEEEE33", // Color of grid lines with transparency
					lineWidth: 1, // Thickness of angle lines
				},
				borderColor: "#fff", // Border color of the radar chart
				borderWidth: 1, // Border width of the radar chart
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			datalabels: {
				display: true, // Display data labels
				anchor: "end",
				align: "end",
				color: "#F3F3F3", // Color of the data labels
				font: {
					size: 16, // Font size of the data labels
					weight: "bold", // Font weight of the data labels
				},
				formatter: (value: number) => value.toString(), // Format the data labels
			},
		},
	};

	return (
		<div className="w-[80%]  h-fit">
			<Radar data={data} options={options as any} />
		</div>
	);
};

export default RadarChart;
