import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface CollapseProps {
	onCollapseToggle: (isCollapsed: boolean) => void;
	expanded?: any;
	icon?: StaticImport;
}

const Hamburger: React.FC<CollapseProps> = ({
	onCollapseToggle,
	expanded,
	icon,
}) => {
	const [isCollapsed, setIsCollapsed] = useState(true);
	console.log(expanded, "expanded");
	const toggleView = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		const newCollapseState = !isCollapsed;
		setIsCollapsed(newCollapseState);
		onCollapseToggle(newCollapseState);
	};

	useEffect(() => {
		if (expanded && expanded === true) {
			setIsCollapsed(expanded);
			onCollapseToggle(expanded); // Use the updated value directly
		}
	}, [expanded]);

	return (
		<>
			{icon ? (
				<button onClick={toggleView} className="w-fit -mr-2">
					<Image src={icon} alt="menu icon" className="w-10" />
				</button>
			) : (
				<div className="hamburger">
					<input
						hidden
						className="check-icon"
						id="check-icon"
						name="check-icon"
						type="checkbox"
						checked={!isCollapsed}
					/>
					<label
						className="icon-menu"
						htmlFor="check-icon"
						onClick={toggleView}
					>
						<div className="bar bar--1"></div>
						<div className="bar bar--2"></div>
						<div className="bar bar--3"></div>
					</label>
				</div>
			)}
		</>
	);
};

export default Hamburger;
