import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import "tailwindcss/tailwind.css";

import { ProfileSetup } from "@/components/ProfileSetup";
import { ProfileInfoContext, ProfileInfo } from "@/contexts/ProfileInfoContext";
import { SearchContext } from "@/contexts/SearchContext";
import { UserContext, User } from "@/contexts/UserContext";
import { DashboardLayout } from "@/dashboard/Layout";

import { supabase } from "../utils/supabaseClient";

//TODO: Add in supabase policies for database and storage

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isProfileSetupComplete, setProfileSetupComplete] = useState();
  const [profileInfo, setProfileInfo] = useState<ProfileInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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
          .select("*")
          .eq("user_id", session.data.session?.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          const isSetupComplete = profileData?.created_profile;
          console.log("Is profile setup complete:", isSetupComplete);
          setProfileSetupComplete(isSetupComplete);
          setProfileInfo(profileData);
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
    <UserContext.Provider value={{ user, setUser }}>
      <ProfileInfoContext.Provider value={{ profileInfo, setProfileInfo }}>
        <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
          <Head>
            <title>KeyFind</title>
          </Head>

          <DashboardLayout>
            <div className="flex justify-center">
              {!isProfileSetupComplete && user ? <ProfileSetup /> : null}
            </div>
            {!isProfileSetupComplete && !user ? (
              <Component {...pageProps} />
            ) : null}
            {isProfileSetupComplete && user ? (
              <Component {...pageProps} />
            ) : null}
          </DashboardLayout>
        </SearchContext.Provider>
      </ProfileInfoContext.Provider>
    </UserContext.Provider>
  );
}

export default MyApp;
