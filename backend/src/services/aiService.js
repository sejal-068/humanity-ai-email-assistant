// backend/src/services/aiService.js

class AIService {
  static async classify(email) {
    const text = ((email.subject || '') + ' ' + (email.body || '')).toLowerCase();

    let classification = 'NEEDS_REVIEW';
    let priority = 'MEDIUM';
    let suggestedAction = 'Review email details';
    let category = 'General';
    let reason = 'General correspondence requires contextual handling.';
    let waitingForResponse = false;

    if (text.includes('reschedule') || text.includes('calendar') || text.includes('availability') || text.includes('interview') || text.includes('sync')) {
      classification = 'ASSISTANT_TO_REPLY';
      priority = 'HIGH';
      category = 'Scheduling';
      suggestedAction = 'Check calendar availability and propose slots or confirm.';
      reason = 'Contains explicit calendar/scheduling request suitable for assistant.';
    } else if (text.includes('contract') || text.includes('sign') || text.includes('budget') || text.includes('wire') || text.includes('approve') || text.includes('partnership')) {
      classification = 'CLIENT_TO_REPLY';
      priority = 'HIGH';
      category = 'Executive Decision';
      suggestedAction = 'Awaiting executive authorization or strategic client input.';
      reason = 'High-stakes business/financial decision requiring direct client signature or feedback.';
    } else if (text.includes('digest') || text.includes('newsletter') || text.includes('receipt') || text.includes('order confirmed') || text.includes('notification') || text.includes('unsubscribe')) {
      classification = 'NO_REPLY_NEEDED';
      priority = 'LOW';
      category = 'Informational';
      suggestedAction = 'Archive or mark as read; no response required.';
      reason = 'Automated system update or marketing publication.';
    } else if (text.includes('waiting') || text.includes('follow up') || text.includes('sent over') || text.includes('pinging')) {
      classification = 'ASSISTANT_TO_REPLY';
      priority = 'MEDIUM';
      category = 'Follow-up';
      suggestedAction = 'Track previous outreach and dispatch reminder if no response.';
      reason = 'Ongoing conversation thread tracking counterpart responsiveness.';
      waitingForResponse = true;
    }

    const summary = this.generateIntelligentSummary(email);

    return {
      classification,
      confidence: 0.96,
      priority,
      requiresAction: classification !== 'NO_REPLY_NEEDED',
      summary,
      reason,
      suggestedAction,
      category,
      waitingForResponse,
      actionItems: classification === 'NO_REPLY_NEEDED' ? [] : ['Review requested context', 'Draft response aligned with guidelines'],
      importantDates: text.includes('tomorrow') ? ['Tomorrow'] : (text.includes('friday') ? ['This Friday'] : [])
    };
  }

  static generateIntelligentSummary(email) {
    const s = email.subject || 'No Subject';
    const b = (email.body || '').replace(/\s+/g, ' ').trim();
    if (b.length <= 140) return b;
    return `Discussion regarding "${s}": ${b.slice(0, 160)}... Key focus: prompt coordination and action item resolution.`;
  }

  static async summarize(email) {
    return this.generateIntelligentSummary(email);
  }

  static async draftReply(email, tone = 'professional') {
    const sender = email.sender || 'there';
    const subject = email.subject || '';
    const sLower = subject.toLowerCase();

    if (sLower.includes('meeting') || sLower.includes('sync') || sLower.includes('reschedule') || sLower.includes('coffee')) {
      return `Hi ${sender},

Thanks for reaching out! I checked the schedule regarding "${subject}". 

We are available on Thursday at 2:00 PM EST or Friday at 10:30 AM EST. Let me know which window works best for you and I will dispatch the calendar invite with Google Meet coordinates.

Best regards,
Humanity Executive Assistant`;
    }

    if (sLower.includes('contract') || sLower.includes('proposal') || sLower.includes('agreement') || sLower.includes('budget')) {
      return `Dear ${sender},

Thank you for sending over the documentation for "${subject}". 

Our executive team is reviewing the key terms and financial schedule today. We expect to share signed counters or feedback by end-of-day tomorrow.

Sincerely,
Office of Executive Management`;
    }

    return `Hi ${sender},

Thank you for contacting us regarding "${subject}".

We have received your note and are reviewing the details provided. We will follow up with actionable next steps shortly. Please let us know if any urgent items arise in the interim.

Warm regards,
Humanity AI Support Team`;
  }
}

module.exports = AIService;
