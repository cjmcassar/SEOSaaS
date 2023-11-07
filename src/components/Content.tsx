import { KeyWordGenerator } from "./KeywordGenerator";
import { ProjectCard } from "./ProjectCard";

interface ContentProps {
	title: string;
}

interface ProjectData {
	title: string;
	date: string;
	keywords: string;
}

export function Content(props: ContentProps) {
	const projectData1: ProjectData = {
		title: "Landing Page",
		date: "December 10, 2020",
		keywords:
			"Fashion, Apparel, E-commerce, Online Shopping, SaaS, Marketplace, Clothing, Retail, B2C, Consumer",
	};

	const projectData2: ProjectData = {
		title: "Marketplace",
		date: "December 2, 2022",
		keywords: "E-commerce, Online Shopping, Marketplace, Retail, B2C",
	};

	const projectData3: ProjectData = {
		title: "About Us",
		date: "December 1, 2023",
		keywords:
			"clothing store, about us page, fashion, apparel, e-commerce, online shopping, retail, B2C",
	};

	return (
		<div className="flex flex-wrap">
			<div className="w-full rounded-3xl bg-gray-800 p-6 lg:w-8/12">
				<div className="mb-8 flex items-center justify-between text-white">
					<p className="text-2xl font-bold">{props.title}</p>
					<p className="">December, 12</p>
				</div>
				<div className="flex flex-wrap items-center justify-between pb-8">
					<div className="flex flex-wrap text-white">
						<div className="pr-10">
							<div className="text-2xl font-bold">1200</div>
							<div className="">Keywords Generated</div>
						</div>
						<div className="pr-10">
							<div className="text-2xl font-bold">10</div>
							<div className="">Sessions</div>
						</div>
						<div>
							<div className="text-2xl font-bold">3</div>
							<div className="">Total Keyword List</div>
						</div>
					</div>
				</div>
				<div className="flex flex-wrap">
					<ProjectCard data={projectData1} />
					<ProjectCard data={projectData2} />
					<ProjectCard data={projectData3} />
				</div>
			</div>
			<div className="mt-8 w-full lg:mt-0 lg:w-4/12 lg:pl-4">
				<KeyWordGenerator />
			</div>
		</div>
	);
}
