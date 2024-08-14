import { useState } from "react";
import Hamburger from "./ui/Hamburger";
import GridList from "./ui/GridList";
import exp from "constants";

interface TopbarProps {
	title?: string;
	onViewToggle: (isListView: boolean) => void;
	onCollapseToggle: (isCollapsed: boolean) => void;
	expanded?: any;
}

const Topbar: React.FC<TopbarProps> = ({
	onViewToggle,
	onCollapseToggle,
	title,
	expanded,
}) => {
	const handleViewToggle = (viewState: boolean) => {
		onViewToggle(viewState);
	};
	const handleCollapseToggle = (collapseState: boolean) => {
		onCollapseToggle(collapseState);
	};
	return (
		<div className=" p-5 h-20 border-b flex items-center justify-between border-gray-500/20">
			<Hamburger onCollapseToggle={handleCollapseToggle} expanded={expanded} />

			<span className="text-3xl font-bold text-center">
				{title || "Pokédex"}
			</span>
			<GridList onViewToggle={handleViewToggle} />
		</div>
	);
};

export default Topbar;
