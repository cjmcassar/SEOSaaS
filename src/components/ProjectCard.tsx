interface ProjectData {
	title: string;
	date: string;
	keywords: string;
}

interface ProjectCardProps {
	data: ProjectData;
}

export const ProjectCard = ({ data }: ProjectCardProps) => {
	return (
		<div className="w-full md:w-4/12">
			<div className="p-2">
				<div className="rounded-3xl bg-purple-200 p-4">
					<div className="flex items-center">
						<span className="text-sm">{data.date}</span>
					</div>
					<div className="mb-4 mt-5 text-center">
						<p className="text-base font-bold opacity-70">{data.title}</p>
						<p className=" opacity-70">Sample SEO Analysis:</p>
						<p
							className="mt-2 truncate text-sm opacity-70"
							style={{ fontSize: "smaller" }}
						>
							{data.keywords.split(" ").slice(0, 5).join(" ")}
						</p>
					</div>
					<div>
						<p className="m-0 text-sm font-bold">Download</p>
						<a
							href="/path/to/csv/file.csv"
							download
							className="mx-0 my-2 text-purple-700 underline"
						>
							Full CSV file
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};
