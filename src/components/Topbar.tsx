import { useState } from "react";
import Hamburger from "./ui/Hamburger";

const Topbar = ({ title }: { title?: string }) => {
	return (
		<div className=" p-5 h-20 border-b flex items-center justify-between border-gray-500/20">
			<Hamburger />

			<span className="text-3xl font-bold text-center">
				{title || "Pokédex"}
			</span>
			<span className="text-3xl font-bold text-center"></span>
		</div>
	);
};

export default Topbar;
