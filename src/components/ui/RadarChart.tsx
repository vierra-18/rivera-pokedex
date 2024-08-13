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

ChartJS.register(
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend
);

type RadarChartProps = {
	stats: { stat: { name: string }; base_stat: number }[];
};

const RadarChart: React.FC<RadarChartProps> = ({ stats }) => {
	const data = {
		labels: stats.map((stat) =>
			stat.stat.name
				.toString()
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")
		),
		datasets: [
			{
				label: "Base Stats",
				data: stats.map((stat) => stat.base_stat),
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				borderColor: "rgba(75, 192, 192, 1)",
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
				suggestedMax: 250,
				ticks: {
					beginAtZero: true,
					// stepSize: 85, // Optional step size
					max: 250,
				},
				pointLabels: {
					font: {
						size: 14, // Font size for point labels
						weight: "bold", // Font weight for point labels
					},
				},
			},
		},
		plugins: {
			legend: {
				display: false,
			},
		},
	};

	return (
		<div className=" w-[80%] h-[50rem]">
			{" "}
			{/* Adjust the height as needed */}
			<Radar data={data} options={options as any} />
		</div>
	);
};

export default RadarChart;
