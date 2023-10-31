interface ContentProps {
	title: string;
}

const ProjectCard = () => {
	return (
		<div className="w-full md:w-4/12">
			<div className="p-2">
				<div className="rounded-3xl bg-purple-200 p-4">
					<div className="flex items-center">
						<span className="text-sm">December 10, 2020</span>
					</div>
					<div className="mb-4 mt-5 text-center">
						<p className="text-base font-bold opacity-70">Landing Page</p>
						<p className="mt-2 text-sm opacity-70">Keywords List</p>
					</div>
					<div>
						<p className="m-0 text-sm font-bold">Progress</p>
						<div className="mx-0 my-2 h-1 w-full overflow-hidden rounded-md bg-white">
							<span className="block h-1 w-7/12 rounded-md bg-purple-700" />
						</div>
						<p className="m-0 text-right text-sm font-bold">70%</p>
					</div>
					<div className="relative flex justify-between pt-4">
						<div className="flex items-center">
							<img
								className="h-5 w-5 overflow-hidden rounded-full object-cover"
								src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
								alt="participant11"
							/>
							<img
								className="h-5 w-5 overflow-hidden rounded-full object-cover"
								src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbnxlbnwwfHwwfA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60"
								alt="participant12"
							/>
							<button className="ml-3 flex h-5 w-5 items-center justify-center rounded-full border-none bg-white p-0">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="3"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M12 5v14M5 12h14" />
								</svg>
							</button>
						</div>
						<div className="flex shrink-0 rounded-lg px-4 py-2 text-sm font-bold text-purple-700">
							2 Days Left
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const KeyWordGenerator = () => {
	return (
		<div className="rounded-3xl bg-gray-800 px-6 pt-6 ">
			<div className="flex pb-6 text-2xl font-bold text-white">
				<p>Generate Keywords</p>
			</div>
			<div>
				<form>
					<label
						className="mb-2 block text-sm font-bold text-gray-400"
						htmlFor="business"
					>
						What does your business do?
					</label>
					<textarea
						className=" w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-400 shadow focus:outline-none"
						id="business"
						placeholder="Your answer"
					/>
					<div className="mt-4 flex justify-center">
						<button
							className="mb-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
							type="button"
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export function Content(props: ContentProps) {
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
							<div className="">Total Projects</div>
						</div>
					</div>
				</div>
				<div className="flex flex-wrap">
					<ProjectCard />
					<ProjectCard />
					<ProjectCard />
				</div>
			</div>
			<div className="mt-8 w-full lg:mt-0 lg:w-4/12 lg:pl-4">
				<KeyWordGenerator />
			</div>
		</div>
	);
}
