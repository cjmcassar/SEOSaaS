import { ProfileIcon } from "@/components/ProfileIcon";
import { useDashboardContext } from "./Provider";

interface MenuButtonProps {
	onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onClick }) => (
	<button
		type="button"
		aria-expanded="false"
		aria-label="Toggle sidenav"
		onClick={onClick}
		className="text-4xl text-white focus:outline-none"
	>
		&#8801;
	</button>
);

const CrossIcon = () => (
	<svg
		fill="none"
		className="relative h-5 w-5"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="2"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
	</svg>
);

const SearchIcon = () => (
	<svg
		className="pointer-events-none absolute left-0 ml-4 hidden h-4 w-4 fill-white text-gray-100 group-hover:text-gray-400 sm:block"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 20 20"
	>
		<path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
	</svg>
);

export function TopBar() {
	const { openSidebar } = useDashboardContext();
	return (
		<header className="relative z-10 h-20 items-center">
			<div className="relative z-10 mx-auto flex h-full flex-col justify-center px-3 text-white">
				<div className="relative flex w-full items-center pl-1 sm:ml-0 sm:pr-2">
					<div className="group relative flex h-full w-12 items-center">
						<MenuButton onClick={openSidebar ? openSidebar : () => {}} />
					</div>
					<div className="container relative left-0 flex w-3/4">
						<div className="group relative ml-8 hidden w-full items-center md:flex lg:w-72">
							<div className="absolute flex h-10 w-auto cursor-pointer items-center justify-center p-3 pr-2 text-sm uppercase text-gray-500 sm:hidden">
								<CrossIcon />
							</div>
							<SearchIcon />
							<input
								type="text"
								className="block w-full rounded-2xl bg-gray-800 py-1.5 pl-10 pr-4 leading-normal text-gray-400 opacity-90 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Search"
							/>
						</div>
					</div>
					<div className="relative ml-5 flex w-full items-center justify-end p-1 sm:right-auto sm:mr-0">
						<ProfileIcon />
					</div>
				</div>
			</div>
		</header>
	);
}
