import React from "react";
import TypeBadge from "./ui/TypeBadge";
import { PokemonTypeName } from "@/utils/types";

interface TypeAdvantageProps {
	weaknesses?: string[];
	strengths?: string[];
}

const TypeAdvantage: React.FC<TypeAdvantageProps> = ({
	weaknesses,
	strengths,
}) => {
	return (
		<div className="my-1">
			{/* {weaknesses && <h3 className="text-xl font-semibold">Weak Against:</h3>} */}
			{weaknesses && weaknesses.length > 0 ? (
				<div className="flex flex-wrap">
					{weaknesses.map((type) => (
						<TypeBadge key={type} typeName={type as PokemonTypeName} />
					))}
				</div>
			) : (
				<></>
			)}
			{/* {strengths && (
				<h3 className="text-xl font-semibold">Strong Against:</h3>
			)} */}
			{strengths && strengths.length > 0 ? (
				<div className="flex flex-wrap">
					{strengths.map((type) => (
						<TypeBadge key={type} typeName={type as PokemonTypeName} />
					))}
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default TypeAdvantage;
