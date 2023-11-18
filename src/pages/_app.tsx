import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import "tailwindcss/tailwind.css";

import { DashboardLayout } from "@/dashboard/Layout";
import { ProfileSetup } from "@/components/ProfileSetup";
import { supabase } from "../utils/supabaseClient";

type User = {
	id: string;
	email: string | null;
};

function MyApp({ Component, pageProps }: AppProps) {
	const [user, setUser] = useState<User | null>(null);
	// Todo: make this use state a cookie instead of a state later. Just doing this atm to test route
	const [isProfileSetupComplete, setProfileSetupComplete] = useState();
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			console.log("Fetching user...");
			const { data, error } = await supabase.auth.getUser();
			if (error || !data.user) {
				console.error("Error fetching user:", error);
			} else {
				console.log("User fetched successfully:", user);
				setUser({
					id: data.user?.id,
					email: data.user?.email || null,
				});

				const { data: profileData, error: profileError } = await supabase
					.from("profiles")
					.select("created_profile")
					.eq("user_id", user?.id)
					.single();

				if (profileError) {
					console.error("Error fetching profile:", profileError);
				} else {
					const isSetupComplete = profileData?.created_profile;
					setProfileSetupComplete(isSetupComplete);
				}
			}
		};

		console.log("Calling fetchUser...");
		fetchUser();
	}, []);

	useEffect(() => {
		if (!user) {
			router.push("/NotLoggedIn");
		} else if (user && router.pathname === "/NotLoggedIn") {
			router.push("/");
		}
	}, [user, router]);

	return (
		<>
			<Head>
				<title>KeyFind</title>
			</Head>

			<DashboardLayout>
				<div className="flex justify-center">
					{" "}
					{!isProfileSetupComplete && <ProfileSetup />}{" "}
				</div>
				{isProfileSetupComplete && <Component {...pageProps} />}
			</DashboardLayout>
		</>
	);
}

export default MyApp;
