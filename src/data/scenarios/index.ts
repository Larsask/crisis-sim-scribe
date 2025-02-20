import { ransomwareScenario } from './cyber/ransomware';
import { dataBreachScenario } from './cyber/breach';
import { ddosScenario } from './cyber/ddos';
import { phishingScenario } from './cyber/phishing';
import { insiderThreatScenario } from './cyber/insider';
import { viralDisinfoScenario } from './misinfo/viral';
import { executiveMisconductScenario } from './reputation/executive';
import { aiHiringScenario } from './ai/hiring';
import { supplyChainScenario } from './hybrid/supply';
import { liveEventScenario } from './realtime/event';
import { engineerThreatScenario } from './insider/engineer';

export const scenarios = {
  ransomwareScenario,
  dataBreachScenario,
  ddosScenario,
  phishingScenario,
  insiderThreatScenario,
  viralDisinfoScenario,
  executiveMisconductScenario,
  aiHiringScenario,
  supplyChainScenario,
  liveEventScenario,
  engineerThreatScenario
};
