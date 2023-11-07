import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { questionSteps } from "./data/FormQuestions";

export const KeyWordGenerator = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [step, setStep] = useState(1);

	const onSubmit = (data: any) => {
		console.log(data);
		setStep((prevStep) => prevStep + 1);
	};

	return (
		<div className="rounded-3xl bg-gray-800 px-6 pt-6 ">
			<div className="flex pb-6 text-2xl font-bold text-white">
				<p>Generate Keywords</p>
			</div>
			<div>
				<form onSubmit={handleSubmit(onSubmit)}>
					{questionSteps.map(
						(stepItem, index) =>
							index + 1 === step && (
								<div key={stepItem.id}>
									<label htmlFor={stepItem.name}>{stepItem.question}</label>
									<input
										type="text"
										id={stepItem.name}
										placeholder={stepItem.placeholder}
										required={stepItem.validation.required}
										{...register(stepItem.name)}
									/>
								</div>
							),
					)}
					{/* Add more steps as needed */}
					<div className="mt-4 flex justify-center">
						<button
							className="mb-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
							type="submit"
						>
							Next
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
