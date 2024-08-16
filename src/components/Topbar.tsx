import React from "react";
import Hamburger from "./ui/Hamburger";
import GridList from "./ui/GridList";
import { useWindowSize } from "@uidotdev/usehooks";

import Pokedex from "../styles/assets/pokedex-1.svg";


interface TopbarProps {
	title?: string;
	onViewToggle: (isListView: boolean) => void;
	onCollapseToggle: (isCollapsed: boolean) => void;
	expanded?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({
	onViewToggle,
	onCollapseToggle,
	title = "Pokédex", // Default title if none provided
	expanded = false, // Default expanded state if none provided
}) => {
	const size = useWindowSize();

	const handleViewToggle = (viewState: boolean) => {
		onViewToggle(viewState);
	};

	const handleCollapseToggle = (collapseState: boolean) => {
		onCollapseToggle(collapseState);
	};

	return (
		<div className="p-5 h-20 border-b flex items-center justify-between border-gray-500/20">
			<Hamburger icon={Pokedex} onCollapseToggle={handleCollapseToggle} expanded={expanded} />

			<span className="text-3xl font-bold text-center">
				{title || "Pokédex"}
			</span>
			{/* {size.width && size.width >= 640 ? (
				<GridList onViewToggle={handleViewToggle} />
			) : (
				<div className="p-3"></div>
			)} */}
			<GridList onViewToggle={handleViewToggle} />
		</div>
	);
};

export default Topbar;
