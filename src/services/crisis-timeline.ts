
import { TimeBasedEvent } from '@/types/crisis-enhanced';
import { generateDynamicUpdates } from '@/utils/scenario-generator';

export class CrisisTimeline {
  private events: TimeBasedEvent[] = [];
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
    this.initializeDefaultEvents();
  }

  private initializeDefaultEvents() {
    this.events = [
      {
        triggerTime: 2 * 60 * 1000, // 2 minutes
        type: 'media',
        content: "Breaking news coverage begins to circulate about the situation.",
        severity: 'medium',
        requiresResponse: true,
        options: [
          {
            text: "Issue immediate statement",
            impact: 'neutral',
            consequence: "Quick response but might lack complete information"
          },
          {
            text: "Gather more information first",
            impact: 'positive',
            consequence: "Better informed but slower response"
          }
        ]
      },
      {
        triggerTime: 5 * 60 * 1000, // 5 minutes
        type: 'government',
        content: "Government regulatory body requests official documentation.",
        severity: 'high',
        requiresResponse: true,
        options: [
          {
            text: "Provide full documentation",
            impact: 'positive',
            consequence: "Shows transparency but exposes all issues"
          },
          {
            text: "Submit partial documentation",
            impact: 'negative',
            consequence: "Maintains some control but risks being seen as uncooperative"
          }
        ]
      }
    ];
  }

  public getDueEvents(currentTime: number): TimeBasedEvent[] {
    const elapsedTime = currentTime - this.startTime;
    return this.events
      .filter(event => event.triggerTime <= elapsedTime)
      .sort((a, b) => a.triggerTime - b.triggerTime);
  }

  public addEvent(event: TimeBasedEvent) {
    this.events.push(event);
    this.events.sort((a, b) => a.triggerTime - b.triggerTime);
  }

  public async skipTime(minutesToSkip: number, crisisState: any): Promise<TimeBasedEvent[]> {
    const skipTimeInMs = minutesToSkip * 60 * 1000;
    const newTime = Date.now() + skipTimeInMs;
    
    // Get events that would have triggered during the skipped time
    const skippedEvents = this.events.filter(event => 
      event.triggerTime > Date.now() - this.startTime &&
      event.triggerTime <= newTime - this.startTime
    );

    // Generate additional dynamic updates for the skipped time
    const updates = await generateDynamicUpdates(null, crisisState, [], true);
    
    // Convert CrisisEvents to TimeBasedEvents
    const dynamicEvents: TimeBasedEvent[] = updates.map(update => ({
      triggerTime: update.timestamp - this.startTime,
      type: update.type,
      content: update.content,
      severity: update.severity || 'medium',
      requiresResponse: update.status === 'escalated',
      options: []
    }));

    // Add all new events to the timeline
    [...skippedEvents, ...dynamicEvents].forEach(event => this.addEvent(event));

    return this.getDueEvents(newTime);
  }
}

export const crisisTimelineService = new CrisisTimeline();
