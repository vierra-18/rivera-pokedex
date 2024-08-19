import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import Rotate from "@/styles/assets/rotate.svg";

interface RotateProps {
	onOrientationToggle: (isDefault: boolean) => void;
}

const RotateButton: React.FC<RotateProps> = ({ onOrientationToggle }) => {
	const [isDefault, setIsDefault] = useState(false);
	const toggleView = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		const newOrientationState = !isDefault;
		setIsDefault(newOrientationState);
		onOrientationToggle(newOrientationState);
	};

	return (
		<>
			<label
				className="block relative cursor-pointer select-none"
				onClick={toggleView}
			>
				<input
					type="checkbox"
					className="cursor-pointer absolute h-0 w-0 peer"
					checked={isDefault}
				/>
				<Image
					src={Rotate}
					alt="rotate icon"
					className=" transition-all duration-500 peer-checked:rotate-180"
				/>
			</label>
		</>
	);
};

export default RotateButton;
