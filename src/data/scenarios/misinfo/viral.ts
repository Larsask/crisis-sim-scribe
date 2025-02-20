
import { ScenarioDefinition } from '../types';
import { initialStep } from './steps/viral/initial';
import { safetyDataStep } from './steps/viral/safety';
import { counterNarrativeStep } from './steps/viral/narrative';
import { factCheckStep } from './steps/viral/factcheck';
import { detailedResultsStep } from './steps/viral/details';

export const viralDisinfoScenario: ScenarioDefinition = {
  id: 'misinfo-1',
  category: 'misinformation',
  inbrief: {
    title: "Viral Disinformation Campaign",
    summary: "A coordinated disinformation campaign falsely claims your company's products cause severe health issues. The claims are spreading rapidly on social media with seemingly credible but fabricated evidence.",
    objectives: [
      "Verify facts and evidence",
      "Counter false narratives",
      "Protect brand reputation",
      "Support affected stakeholders",
      "Document misinformation sources"
    ],
    stakeholders: [
      "PR Team",
      "Legal Department",
      "Product Safety Team",
      "Social Media Team",
      "Customer Support"
    ],
    resources: [
      "Product Safety Data",
      "Media Monitoring Tools",
      "Crisis Communication Plan",
      "External PR Agency",
      "Social Media Dashboard"
    ],
    initialSituation: "A viral post claiming your product caused severe allergic reactions has gained 1 million shares in 3 hours. Manufactured lab reports and fake customer testimonials are being circulated. News media is starting to pick up the story."
  },
  steps: [
    initialStep,
    safetyDataStep,
    counterNarrativeStep,
    factCheckStep,
    detailedResultsStep
  ]
};
