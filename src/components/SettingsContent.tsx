import React from "react";

export const SettingsContent: React.FC = () => {
	return (
		<div className="flex h-screen  flex-wrap rounded-3xl bg-gray-800 p-5">
			<div className="h-max w-full max-w  rounded-3xl bg-white p-5 shadow-md">
				<h2 className="text-center text-2xl font-bold">Profile Settings</h2>
				<form className="flex flex-wrap">
					<div className="w-1/2 pr-2">
						<div className="mt-5">
							<label className="mb-2 block text-sm font-bold text-gray-700">
								Industry:
							</label>
							<input
								type="text"
								name="industry"
								placeholder="What industry do you serve?"
								className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
								style={{ width: "100%" }}
							/>
						</div>
						<div className="mt-5">
							<label className="mb-2 block text-sm font-bold text-gray-700">
								Business model:
							</label>
							<input
								type="text"
								name="businessModel"
								placeholder="SaaS, Agency, Ecom, etc"
								className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
								style={{ width: "100%" }}
							/>
						</div>
						<div className="mt-5">
							<label className="mb-2 block text-sm font-bold text-gray-700">
								Most profitable products/services:
							</label>
							<input
								type="text"
								name="profitableProducts"
								placeholder="Tell us what is working?"
								className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
								style={{ width: "100%" }}
							/>
						</div>
						<div className="mt-5">
							<label className="mb-2 block text-sm font-bold text-gray-700">
								Target audience / ideal customer:
							</label>
							<input
								type="text"
								name="targetAudience"
								placeholder="Who do you create value for?"
								className="w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
								style={{ width: "100%" }}
							/>
						</div>
					</div>
					<div className="w-1/2 pl-2">
						<div className="mt-5">
							<label className="mb-2 block text-sm font-bold text-gray-700">
								Competitors' content:
							</label>
							<textarea
								name="competitorsContent"
								placeholder="What content are your competitors creating that is also relevant to your business?"
								className="h-20 w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
								style={{ width: "100%" }}
							/>
						</div>
						<div className="mt-5">
							<label className="mb-2 block text-sm font-bold text-gray-700">
								Unique Value Proposition:
							</label>
							<textarea
								name="valueProposition"
								placeholder="What is your business’s Unique Value Proposition?"
								className="h-20 w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
								style={{ width: "100%" }}
							/>
						</div>
						<div className="mt-5">
							<label className="mb-2 block text-sm font-bold text-gray-700">
								Primary business objectives:
							</label>
							<textarea
								name="businessObjectives"
								placeholder="What are your primary business objectives?"
								className="h-20 w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
								style={{ width: "100%" }}
							/>
						</div>
						<div className="mt-5">
							<label className="mb-2 block text-sm font-bold text-gray-700">
								Benefits of your products/services:
							</label>
							<textarea
								name="keyFeatures"
								placeholder="What are the key features and benefits of your products/services?"
								className="h-20 w-full rounded-lg border px-4 py-2 text-gray-700 focus:border-indigo-500 focus:outline-none"
								style={{ width: "100%" }}
							/>
						</div>
					</div>
					<div className="flex justify-center">
						<button
							type="submit"
							className="mt-5 w-max rounded-full bg-indigo-500 px-4 py-2 font-bold text-white hover:bg-indigo-700"
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
