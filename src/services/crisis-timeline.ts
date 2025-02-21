
import { TimeBasedEvent } from '@/types/crisis-enhanced';
import { generateDynamicUpdates } from '@/utils/scenario-generator';
import { crisisMemoryManager } from '@/utils/crisis-memory';

export class CrisisTimeline {
  private events: TimeBasedEvent[] = [];
  private startTime: number;
  private lastUpdateTime: number;

  constructor() {
    this.startTime = Date.now();
    this.lastUpdateTime = this.startTime;
    this.initializeDefaultEvents();
  }

  private initializeDefaultEvents() {
    this.events = [
      {
        triggerTime: 2 * 60 * 1000,
        type: 'media',
        content: "Breaking news coverage begins to circulate about potential AI bias in your company's hiring system.",
        severity: 'medium',
        requiresResponse: true,
        options: [
          {
            text: "Issue immediate statement acknowledging concerns",
            impact: 'neutral',
            consequence: "Quick response shows proactivity but may lack complete information"
          },
          {
            text: "Conduct rapid internal review before responding",
            impact: 'positive',
            consequence: "Better informed response but media speculation may increase"
          }
        ]
      },
      {
        triggerTime: 5 * 60 * 1000,
        type: 'stakeholder',
        content: "Employee advocacy group demands transparency about AI decision-making processes.",
        severity: 'high',
        requiresResponse: true,
        options: [
          {
            text: "Share detailed AI methodology documentation",
            impact: 'positive',
            consequence: "Builds trust but exposes technical vulnerabilities"
          },
          {
            text: "Provide high-level overview of safeguards",
            impact: 'negative',
            consequence: "Maintains control but may be seen as evasive"
          }
        ]
      }
    ];
  }

  public getDueEvents(currentTime: number): TimeBasedEvent[] {
    const elapsedTime = currentTime - this.startTime;
    const dueEvents = this.events
      .filter(event => event.triggerTime <= elapsedTime)
      .sort((a, b) => a.triggerTime - b.triggerTime);

    // Generate dynamic updates if enough time has passed
    if (currentTime - this.lastUpdateTime > 60000) { // 1 minute between updates
      this.lastUpdateTime = currentTime;
      this.generateDynamicEvent();
    }

    return dueEvents;
  }

  private async generateDynamicEvent() {
    const crisisState = crisisMemoryManager.getCrisisState();
    const updates = await generateDynamicUpdates(null, crisisState, [], false);
    
    updates.forEach(update => {
      const timeBasedEvent: TimeBasedEvent = {
        triggerTime: update.timestamp - this.startTime,
        type: update.type,
        content: update.content,
        severity: update.severity || 'medium',
        requiresResponse: update.status === 'escalated',
        options: []
      };
      this.addEvent(timeBasedEvent);
    });
  }

  public addEvent(event: TimeBasedEvent) {
    this.events.push(event);
    this.events.sort((a, b) => a.triggerTime - b.triggerTime);
  }

  public async skipTime(minutesToSkip: number, crisisState: any): Promise<TimeBasedEvent[]> {
    const skipTimeInMs = minutesToSkip * 60 * 1000;
    const newTime = Date.now() + skipTimeInMs;
    
    // Generate multiple events for the skipped period
    const numberOfEvents = Math.floor(Math.random() * 3) + 2; // 2-4 events
    const updates: TimeBasedEvent[] = [];
    
    for (let i = 0; i < numberOfEvents; i++) {
      const timeOffset = Math.floor(Math.random() * skipTimeInMs);
      const dynamicUpdates = await generateDynamicUpdates(null, crisisState, [], true);
      
      dynamicUpdates.forEach(update => {
        updates.push({
          triggerTime: (Date.now() + timeOffset) - this.startTime,
          type: update.type,
          content: update.content,
          severity: update.severity || 'medium',
          requiresResponse: update.status === 'escalated',
          options: []
        });
      });
    }

    // Add immediate time skip notification
    updates.unshift({
      triggerTime: Date.now() - this.startTime,
      type: 'system',
      content: `Time advanced by ${minutesToSkip} minutes. Multiple developments occurred during this period.`,
      severity: 'medium',
      requiresResponse: false,
      options: []
    });

    // Add all new events to the timeline
    updates.forEach(event => this.addEvent(event));

    return this.getDueEvents(newTime);
  }
}

export const crisisTimelineService = new CrisisTimeline();
