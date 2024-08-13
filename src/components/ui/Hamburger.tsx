const Hamburger = () => {
	return (
		<div className="hamburger lg:hidden">
			<input
				hidden
				className="check-icon"
				id="check-icon"
				name="check-icon"
				type="checkbox"
			/>
			<label className="icon-menu" htmlFor="check-icon">
				<div className="bar bar--1"></div>
				<div className="bar bar--2"></div>
				<div className="bar bar--3"></div>
			</label>
		</div>
	);
};

export default Hamburger;
