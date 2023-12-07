export const keyWordQuestionSteps = [
  {
    id: 1,
    question: "What is the name of your project?",
    name: "contentName",
    placeholder: "Example: SuperSaaS",
    validation: { required: true },
  },
  {
    id: 2,
    question:
      "Are the keywords for your homepage, landing page, product page, or blog post?",
    name: "contentType",
    type: "dropdown", // Specify that this is a dropdown type question
    options: ["Homepage", "Landing Page", "Product Page", "Blog Post"],
    placeholder: "Select a page type",
    validation: { required: true },
  },
  {
    id: 3,
    question:
      "What is the focus of the page / keyword list? Be as specific or general as you like!",
    name: "contentFocus",
    placeholder: "Example: SEO optimization for SaaS products",
    validation: { required: true },
  },
  {
    id: 4,
    question:
      "What frequently asked questions from your audience do you want to answer in the content?",
    name: "audienceFAQs",
    placeholder: "Example: How does SEO optimization work?",
    validation: { required: true },
  },
  {
    id: 5,
    question:
      "That's it! Submit your answers to generate your project's SEO keywords!",
    name: "finalStep",
    placeholder: "",
    validation: { required: false },
  },
];
