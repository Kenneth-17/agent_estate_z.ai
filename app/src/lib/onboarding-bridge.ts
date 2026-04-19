import { sendMessage } from "@/lib/api";

export interface OnboardingData {
  name: string;
  email: string;
  phone: string;
  dob: string;
  sex: string;
  persona: string | null;
  budget: string | null;
  bedrooms: string | null;
  commute: string | null;
  priorities: string[];
}

const PERSONA_MESSAGES: Record<string, string> = {
  professional: "I'm moving to London for work. I have a new job starting soon.",
  family: "I'm moving to London with my family. We have kids and need a safe neighbourhood with good schools.",
  student: "I'm coming to London to study at university. I need something budget-friendly close to my campus.",
  newcomer: "I'm relocating to London. This is my first time living in the city.",
};

export async function submitOnboardingStep(
  step: string,
  data: OnboardingData,
  sessionId: string,
) {
  let message = "";

  switch (step) {
    case "persona":
      message = `${PERSONA_MESSAGES[data.persona!]} I'm ${data.name}.`;
      break;
    case "budget":
      message = `My monthly budget is ${data.budget}.`;
      break;
    case "bedrooms":
      message = `I need ${data.bedrooms}.`;
      break;
    case "commute":
      message = `I'll be commuting to ${data.commute} every day.`;
      break;
    case "priorities":
      message = `What matters most to me: ${data.priorities.join(", ")}. That's everything — build my rental passport.`;
      break;
  }

  return sendMessage(message, sessionId);
}
