import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import "tailwindcss/tailwind.css";

import { DashboardLayout } from "@/dashboard/Layout";
import { ProfileSetup } from "@/components/ProfileSetup";
import { supabase } from "../utils/supabaseClient";

type User = {
	id: string | undefined;
	email: string | null;
};

function MyApp({ Component, pageProps }: AppProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isProfileSetupComplete, setProfileSetupComplete] = useState();
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			console.log("Fetching user...");
			const session = await supabase.auth.getSession();
			if (session.data.session === null) {
				console.error("Error fetching user:", session);
			} else {
				console.log("User fetched successfully:", session.data.session.user);
				setUser({
					id: session.data.session?.user.id,
					email: session.data.session?.user.email || null,
				});

				const { data: profileData, error: profileError } = await supabase
					.from("profiles")
					.select("created_profile")
					.eq("user_id", session.data.session?.user.id)
					.single();

				if (profileError) {
					console.error("Error fetching profile:", profileError);
				} else {
					const isSetupComplete = profileData?.created_profile;
					console.log("Is profile setup complete:", isSetupComplete);
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
					{!isProfileSetupComplete && user ? <ProfileSetup /> : null}
				</div>
				{!isProfileSetupComplete && !user ? <Component {...pageProps} /> : null}
				{isProfileSetupComplete && user ? <Component {...pageProps} /> : null}
			</DashboardLayout>
		</>
	);
}

export default MyApp;
