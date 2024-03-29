import { useCallback, useContext, useEffect, useState } from "react";

import { SearchContext } from "@/contexts/SearchContext";
import { UserContext } from "@/contexts/UserContext";
import { supabase } from "@/utils/supabaseClient";

import { KeyWordGenerator } from "./KeywordGenerator";
import { ProjectCard } from "./ProjectCard";

interface ContentProps {
  title: string;
}

interface ProjectData {
  id: string;
  title: string;
  created_at: string;
  project_name: string;
  project_type: string;
  gpt_keyword_sample: string;
  csv_file_path: string;
  amount_of_keywords: number;
}

export interface ProjectCardProps {
  data: ProjectData;
}

export function Content(props: ContentProps) {
  const [projects, setProjects] = useState<ProjectData[] | null>(null);
  const user = useContext(UserContext);
  const { searchTerm } = useContext(SearchContext);

  const fetchProjects = useCallback(async () => {
    if (user) {
      const { data: projectsData, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user?.user?.id);

      if (error) console.log("Error fetching project data: ", error);
      else {
        setProjects(projectsData);
        console.log("projects data:", projectsData);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchProjects();

    const subscription = supabase
      .channel("room1")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "projects" },
        payload => {
          console.log("Change received!", payload);

          fetchProjects();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchProjects]);

  const filteredProjects = projects?.filter(project =>
    project.gpt_keyword_sample.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  console.log("projects:", projects);

  if (!projects) return <div>Loading...</div>;

  //todo: 1.
  // 2. add in ability to edit current projects
  // 3. add in abaility to delete current projects
  // 4. add in country selection

  return (
    <div className="flex flex-wrap">
      <div className="w-full rounded-3xl bg-gray-800 p-6 lg:w-8/12">
        <div className="mb-8 flex items-center justify-center text-white">
          <p className="text-2xl font-bold">{props.title}</p>
        </div>
        <div className="flex flex-wrap items-center justify-between pb-8">
          <div className="flex flex-wrap text-white">
            <div className="pr-10">
              <div className="text-2xl font-bold">
                {projects?.reduce(
                  (total, project) => total + project.amount_of_keywords,
                  0,
                )}
              </div>
              <div className="">Keywords Generated</div>
            </div>
            <div className="pr-10">
              <div className="text-2xl font-bold">{projects?.length}</div>
              <div className="">SEO Projects</div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap">
          {filteredProjects?.map(project => (
            <ProjectCard key={project.id} data={project} />
          ))}
        </div>
      </div>
      <div className="mt-8 w-full lg:mt-0 lg:w-4/12 lg:pl-4">
        <KeyWordGenerator />
      </div>
    </div>
  );
}
