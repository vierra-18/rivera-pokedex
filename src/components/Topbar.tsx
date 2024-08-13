import { useState } from "react";
import Hamburger from "./ui/Hamburger";
import GridList from "./ui/GridList";

interface TopbarProps {
	title?: string;
	onViewToggle: (isListView: boolean) => void;
}

const Topbar: React.FC<TopbarProps> = ({ onViewToggle, title }) => {
	const handleViewToggle = (viewState: boolean) => {
		onViewToggle(viewState);
		// Any additional logic for ParentComponent
	};
	return (
		<div className=" p-5 h-20 border-b flex items-center justify-between border-gray-500/20">
			<Hamburger />

			<span className="text-3xl font-bold text-center">
				{title || "Pokédex"}
			</span>
			<GridList onViewToggle={handleViewToggle} />
		</div>
	);
};

export default Topbar;
