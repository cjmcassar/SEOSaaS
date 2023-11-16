export const keyWordQuestionSteps = [
	{
		id: 1,
		question:
			"Are the keywords for your homepage, landing page, product page or blog post?",
		name: "contentType",
		placeholder: "Your answer",
		validation: { required: true },
	},
	{
		id: 2,
		question:
			"What is the focus of the page / keyword list? Be as specific or general as you like!",
		name: "contentFocus",
		placeholder: "Your answer",
		validation: { required: true },
	},
	{
		id: 3,
		question:
			"What frequently asked questions from your audience do you want to answer in the content?",
		name: "faq",
		placeholder: "Your answer",
		validation: { required: true },
	},
	{
		id: 4,
		question:
			"That's it! Submit your answers to generate your project's SEO keywords!",
		name: "finalStep",
		placeholder: "",
		validation: { required: false },
	},
];
