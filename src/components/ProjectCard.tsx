import { supabase } from "@/utils/supabaseClient";

import { ProjectCardProps } from "./Content";

export const ProjectCard = ({ data }: ProjectCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = date.getFullYear().toString().substr(-2);

    return `${day}-${month}-${year}`;
  };

  const formatProjectType = (projectType: string) => {
    return projectType
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formattedProjectType = formatProjectType(data.project_type);

  const formattedDate = formatDate(data.created_at);

  return (
    <div className="w-full md:w-4/12">
      <div className="p-2">
        <div className="rounded-3xl bg-purple-200 p-4">
          <div className="flex justify-center">
            <span className="text-sm">{formattedDate}</span>
          </div>
          <div className="text-center text-2xl font-bold">
            {data.project_name}
          </div>
          <div className="mb-4 mt-5 text-center">
            <p className="text-base opacity-70">{formattedProjectType}</p>
            <p className=" opacity-70">Sample Keywords:</p>
            <p
              className="mt-2 truncate text-sm opacity-70"
              style={{ fontSize: "smaller" }}
            >
              {data.gpt_keyword_sample}
            </p>
          </div>
          <div>
            <p className="m-0 text-center text-sm font-bold">Download CSV</p>
            <div className="flex justify-center">
              <button
                onClick={async () => {
                  const { data: blobData, error } = await supabase.storage
                    .from("google-keywords-csv")
                    .download(data.csv_file_path);
                  if (error) throw error;

                  // Create a new URL object from the Blob
                  const downloadUrl = URL.createObjectURL(blobData);

                  const a = document.createElement("a");
                  a.href = downloadUrl;
                  a.download = data.csv_file_path.split("/").pop() || "";
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                }}
                className="mx-0 my-2 rounded bg-purple-700 px-4 py-2 text-white"
              >
                Full CSV file
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
