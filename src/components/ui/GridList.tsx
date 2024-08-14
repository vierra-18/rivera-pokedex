import React, { useState } from 'react';

interface GridListProps {
	onViewToggle: (isListView: boolean) => void;
}

const GridList: React.FC<GridListProps> = ({ onViewToggle }) => {
	const [isListView, setIsListView] = useState(true);

	const toggleView = () => {
		const newViewState = !isListView;
		setIsListView(newViewState);
		onViewToggle(newViewState); // Pass the new state to the parent component
	};

	return (
		<button
			id="grid-list-toggle"
			className={`grid-list ${isListView ? 'list' : 'grid'} show-guide`}
			onClick={toggleView}
		>
			<div className="bar"></div>
			<div className="bar"></div>
			<div className="bar"></div>
		</button>
	);
};

export default GridList;
