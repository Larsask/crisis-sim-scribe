import { ransomwareScenario } from './cyber/ransomware';
import { dataBreachScenario } from './cyber/breach';
import { ddosScenario } from './cyber/ddos';
import { phishingScenario } from './cyber/phishing';
import { insiderThreatScenario } from './cyber/insider';

// Misinformation scenarios
import { viralDisinfoScenario } from './misinfo/viral';
import { politicalDisinfoScenario } from './misinfo/political';
import { scientificDisinfoScenario } from './misinfo/scientific';
import { productDisinfoScenario } from './misinfo/product';
import { financialDisinfoScenario } from './misinfo/financial';

import { executiveMisconductScenario } from './reputation/executive';
import { aiHiringScenario } from './ai/hiring';
import { supplyChainScenario } from './hybrid/supply';
import { liveEventScenario } from './realtime/event';
import { engineerThreatScenario } from './insider/engineer';

export const scenarios = {
  // Cyber scenarios
  ransomwareScenario,
  dataBreachScenario,
  ddosScenario,
  phishingScenario,
  insiderThreatScenario,
  
  // Misinformation scenarios
  viralDisinfoScenario,
  politicalDisinfoScenario,
  scientificDisinfoScenario,
  productDisinfoScenario,
  financialDisinfoScenario,
  
  // Other scenarios
  executiveMisconductScenario,
  aiHiringScenario,
  supplyChainScenario,
  liveEventScenario,
  engineerThreatScenario
};
