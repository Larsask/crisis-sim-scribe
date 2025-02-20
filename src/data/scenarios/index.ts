
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

// Reputation scenarios
import { executiveMisconductScenario } from './reputation/executive';
import { productRecallScenario } from './reputation/recall';
import { employeeScandalScenario } from './reputation/employee';
import { environmentalIncidentScenario } from './reputation/environmental';
import { customerDataScenario } from './reputation/customer';

// AI scenarios
import { aiHiringScenario } from './ai/hiring';
import { aiPrivacyScenario } from './ai/privacy';
import { aiDecisionScenario } from './ai/decision';
import { aiSecurityScenario } from './ai/security';
import { aiEthicsScenario } from './ai/ethics';

// Hybrid scenarios
import { supplyChainScenario } from './hybrid/supply';
import { physicalBreachScenario } from './hybrid/physical';
import { socialEngineeringScenario } from './hybrid/social';
import { industrialSabotageScenario } from './hybrid/sabotage';
import { cryptoTheftScenario } from './hybrid/crypto';

// Real-time scenarios
import { liveEventScenario } from './realtime/event';
import { serviceOutageScenario } from './realtime/outage';
import { systemFailureScenario } from './realtime/failure';
import { securityBreachScenario } from './realtime/breach';
import { infrastructureScenario } from './realtime/infrastructure';

// Insider threat scenarios
import { engineerThreatScenario } from './insider/engineer';
import { executiveLeakScenario } from './insider/executive';
import { contractorBreachScenario } from './insider/contractor';
import { employeeSabotageScenario } from './insider/sabotage';
import { privilegedAccessScenario } from './insider/privileged';

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
  
  // Reputation scenarios
  executiveMisconductScenario,
  productRecallScenario,
  employeeScandalScenario,
  environmentalIncidentScenario,
  customerDataScenario,
  
  // AI scenarios
  aiHiringScenario,
  aiPrivacyScenario,
  aiDecisionScenario,
  aiSecurityScenario,
  aiEthicsScenario,
  
  // Hybrid scenarios
  supplyChainScenario,
  physicalBreachScenario,
  socialEngineeringScenario,
  industrialSabotageScenario,
  cryptoTheftScenario,
  
  // Real-time scenarios
  liveEventScenario,
  serviceOutageScenario,
  systemFailureScenario,
  securityBreachScenario,
  infrastructureScenario,
  
  // Insider threat scenarios
  engineerThreatScenario,
  executiveLeakScenario,
  contractorBreachScenario,
  employeeSabotageScenario,
  privilegedAccessScenario
};
