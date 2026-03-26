export const applicationSteps = [
    { step: 1, label: "Personal Information", description: "Basic personal, contact, and identification details" },
    { step: 2, label: "Academic Background", description: "Secondary school results, JAMB score, and current institution" },
    { step: 3, label: "Essays", description: "Four structured essay responses about your ambitions and values" },
    { step: 4, label: "Documents", description: "Upload supporting documents including transcripts and ID" },
    { step: 5, label: "Review & Submit", description: "Final review of all information before formal submission" },
] as const;

export const programChoices = [
    "Technology & Software Engineering",
    "Healthcare Delivery Systems",
    "Sustainable Energy & Agriculture",
    "Advanced Manufacturing & Engineering",
] as const;
