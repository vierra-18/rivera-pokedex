import React, { useEffect, useState } from "react";

interface CollapseProps {
	onCollapseToggle: (isCollapsed: boolean) => void;
	expanded?: any;
}

const Hamburger: React.FC<CollapseProps> = ({ onCollapseToggle, expanded }) => {
	const [isCollapsed, setIsCollapsed] = useState(true);
	console.log(expanded, "expanded");
	const toggleView = (e: React.MouseEvent<HTMLLabelElement>) => {
		e.stopPropagation();
		e.preventDefault();
		const newCollapseState = !isCollapsed;
		setIsCollapsed(newCollapseState);
		onCollapseToggle(newCollapseState); // Pass the new state to the parent component
	};
	useEffect(() => {
		if (expanded && expanded === true) {
			setIsCollapsed(expanded);
			onCollapseToggle(expanded); // Use the updated value directly
		}
	}, [expanded]);

	return (
		<div className="hamburger  lg:hidden">
			<input
				hidden
				className="check-icon"
				id="check-icon"
				name="check-icon"
				type="checkbox"
				checked={!isCollapsed}
			/>
			<label className="icon-menu" htmlFor="check-icon" onClick={toggleView}>
				<div className="bar bar--1"></div>
				<div className="bar bar--2"></div>
				<div className="bar bar--3"></div>
			</label>
		</div>
	);
};

export default Hamburger;
