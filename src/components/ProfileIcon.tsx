import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import router from "next/router";

export const ProfileIcon = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.reload();
	};

	useEffect(() => {
		const closeDropdown = () => {
			if (dropdownOpen) {
				setDropdownOpen(false);
			}
		};

		window.addEventListener("click", closeDropdown);

		return () => {
			window.removeEventListener("click", closeDropdown);
		};
	}, [dropdownOpen]);

	return (
		<div className="relative">
			<button
				onClick={(e) => {
					e.stopPropagation();
					toggleDropdown();
				}}
				className="relative block"
			>
				<img
					alt="Maurice Lokumba"
					src="/images/1.jpg"
					className="mx-auto h-10 w-10 rounded-full object-cover"
				/>
			</button>
			{dropdownOpen && (
				<div
					onClick={(e) => e.stopPropagation()}
					className="absolute right-0 mt-2 w-48 divide-y divide-gray-100 rounded-md border border-gray-200 bg-white shadow-lg"
				>
					<div className="px-4 py-3">
						<p className="text-sm leading-5">Signed in as</p>
						<p className="truncate text-sm font-medium leading-5 text-gray-900">
							Maurice Lokumba
						</p>
					</div>
					<div className="py-1">
						{/* <a
							href="#"
							className="text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 block px-4 py-2"
						>
							Your Profile
						</a> */}
						<a
							href="#"
							onClick={handleSignOut}
							className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
						>
							Sign out
						</a>
					</div>
				</div>
			)}
		</div>
	);
};
