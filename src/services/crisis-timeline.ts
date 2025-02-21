
import { TimeBasedEvent } from '@/types/crisis-enhanced';

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
      // Add more events as needed
    ];
  }

  public getDueEvents(currentTime: number): TimeBasedEvent[] {
    const elapsedTime = currentTime - this.startTime;
    return this.events.filter(event => event.triggerTime <= elapsedTime);
  }

  public addEvent(event: TimeBasedEvent) {
    this.events.push(event);
    this.events.sort((a, b) => a.triggerTime - b.triggerTime);
  }

  public skipTime(minutesToSkip: number): TimeBasedEvent[] {
    const skipTimeInMs = minutesToSkip * 60 * 1000;
    const newTime = Date.now() + skipTimeInMs;
    return this.getDueEvents(newTime);
  }
}

export const crisisTimelineService = new CrisisTimeline();
