import Head from "next/head";
import "tailwindcss/tailwind.css";
import { AppProps } from "next/app";
import { DashboardLayout } from "@/dashboard/Layout";

import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type User = {
	id: string;
	email: string | null;
};

function MyApp({ Component, pageProps }: AppProps) {
	const [user, setUser] = useState<User | null>(null);
	// Todo: make this use state a cookie instead of a state later. Just doing this atm to test route
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			console.log("Fetching user...");
			const { data, error } = await supabase.auth.getUser();
			if (error) {
				console.error("Error fetching user:", error);
			} else {
				console.log("User fetched successfully:", data);
				setUser({
					id: data.user.id,
					email: data.user.email || null,
				});
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
				<Component {...pageProps} />
			</DashboardLayout>
		</>
	);
}

export default MyApp;
