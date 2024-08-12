import { ReactNode, useState, useEffect, lazy, Suspense } from "react";
import { useRouter } from "next/router";
import AnimatedPokeballs from "./ui/AnimtedPokeballs";

interface LoaderProps {
	children: ReactNode;
}

// const LazyLoadedComponent = lazy(() => import("./LazyLoadedComponent"))

const Loader: React.FC<LoaderProps> = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// Simulate async data fetching or any other async operation
		const fetchData = async () => {
			// Simulate delay
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setTimeout(() => {
				setIsLoading(false);
			}, 500);
		};

		fetchData();
	}, []);

	useEffect(() => {
		const handleStart = () => {
			setIsLoading(true);
		};

		const handleComplete = () => {
			setTimeout(() => {
				setIsLoading(false);
			}, 500);
		};

		handleStart();

		router.events.on("routeChangeStart", handleStart);
		router.events.on("routeChangeComplete", handleComplete);

		return () => {
			router.events.off("routeChangeStart", handleStart);
			router.events.off("routeChangeComplete", handleComplete);
		};
	}, []);

	return (
		<div>
			{isLoading ? (
				<div className=" flex h-screen w-full items-center justify-center ">
					<AnimatedPokeballs />
				</div>
			) : (
				<Suspense
					fallback={
						<div className=" flex h-screen w-full items-center justify-center">
							<AnimatedPokeballs />
						</div>
					}
				>
					{children}
				</Suspense>
			)}
		</div>
	);
};

export default Loader;
