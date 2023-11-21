import { Dispatch, SetStateAction, createContext } from "react";

export type ProfileInfo = {
  // Define your profile fields here
  industry_served: string;
  business_model: string;
  profitable_products_services: string;
  target_audience_ideal_customer: string;
  competitors_relevant_content: string;
  unique_value_proposition: string;
  primary_business_objectives: string;
  key_features_benefits: string;
  created_profile: boolean;
};

type ProfileInfoContextType = {
  profileInfo: ProfileInfo | null;
  setProfileInfo: Dispatch<SetStateAction<ProfileInfo | null>>;
};

export const ProfileInfoContext = createContext<ProfileInfoContextType | null>(
  null,
);
