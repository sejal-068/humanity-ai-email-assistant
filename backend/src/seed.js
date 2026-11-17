// backend/src/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Email = require('./models/Email');
const Conversation = require('./models/Conversation');
const EmailAccount = require('./models/EmailAccount');
const Meeting = require('./models/Meeting');
const Draft = require('./models/Draft');
const Notification = require('./models/Notification');

async function seedData(assistantUser, clientUser) {
  try {
    console.log(`🌱 Seeding rich interconnected demo data for ${assistantUser.email} & ${clientUser.email}...`);

    // Clean up existing data for these specific accounts to guarantee freshness & idempotency
    await Email.deleteMany({ $or: [{ assistantId: assistantUser._id }, { clientId: clientUser._id }] });
    await EmailAccount.deleteMany({ userId: { $in: [assistantUser._id, clientUser._id] } });
    await Draft.deleteMany({ createdBy: { $in: [assistantUser._id, clientUser._id] } });
    await Notification.deleteMany({ recipientId: { $in: [assistantUser._id, clientUser._id] } });
    await Meeting.deleteMany({});

    // 1. Mailbox Accounts
    await EmailAccount.create([
      {
        userId: assistantUser._id,
        provider: 'gmail',
        emailAddress: assistantUser.email,
        connectionStatus: 'connected',
        isDemo: true,
        lastSyncedAt: new Date()
      },
      {
        userId: assistantUser._id,
        provider: 'outlook',
        emailAddress: 'alex.support@outlook.com',
        connectionStatus: 'connected',
        isDemo: true,
        lastSyncedAt: new Date()
      },
      {
        userId: clientUser._id,
        provider: 'gmail',
        emailAddress: clientUser.email,
        connectionStatus: 'connected',
        isDemo: true,
        lastSyncedAt: new Date()
      }
    ]);

    // 2. 22 Realistic emails with diverse categories
    const rawEmails = [
      // ASSISTANT TO REPLY (7 emails)
      {
        subject: "Q4 Board Meeting: Reschedule to Thursday?",
        sender: "Sarah Jenkins (Venture Capital)",
        senderEmail: "sjenkins@summitventures.com",
        category: "Scheduling",
        priority: "HIGH",
        isImportant: true,
        isRead: false,
        classification: "ASSISTANT_TO_REPLY",
        summary: "Sarah requests shifting Wednesday's 10:00 AM Q4 Board meeting to Thursday at 2:00 PM EST or Friday at 11:00 AM EST.",
        suggestedAction: "Check executive calendar and confirm Thursday 2:00 PM EST slot.",
        classificationReason: "Standard calendar scheduling request that can be managed independently by the assistant.",
        waitingForResponse: false,
        requiresAction: true,
        body: "Hi team,\n\nOur general partners have an unavoidable conflict for Wednesday's scheduled 10:00 AM Q4 portfolio review. Can we shift our discussion to Thursday at 2:00 PM EST or Friday at 11:00 AM EST? Please confirm availability so we can update the boardroom calendar.\n\nWarm regards,\nSarah Jenkins\nSummit Ventures"
      },
      {
        subject: "Coffee & Product Strategy Catchup in SF Next Week?",
        sender: "David Kim (Founder & CEO, Nexus AI)",
        senderEmail: "dkim@nexusai.dev",
        category: "Meetings",
        priority: "MEDIUM",
        isImportant: false,
        isRead: false,
        classification: "ASSISTANT_TO_REPLY",
        summary: "David Kim invited the executive for coffee or lunch near SoMa next Tuesday/Wednesday to discuss AI agent workflows.",
        suggestedAction: "Propose 30-min coffee on Tuesday at 3:30 PM near Blue Bottle SoMa.",
        classificationReason: "Networking / informal meeting request suitable for assistant calendar booking.",
        waitingForResponse: false,
        requiresAction: true,
        body: "Hey there! I saw the latest launch and wanted to congratulate you. I'm flying into San Francisco next Tuesday and Wednesday for Tech Week. Are you free for a quick 30-min coffee or lunch near SoMa to compare notes on AI agent architectures?\n\nCheers,\nDavid Kim"
      },
      {
        subject: "Senior Full-Stack AI Engineer Candidate Interview: Alex Vance",
        sender: "Priya Sharma (Tech Talent Recruiter)",
        senderEmail: "priya@venturetalent.io",
        category: "Interview Scheduling",
        priority: "HIGH",
        isImportant: true,
        isRead: false,
        classification: "ASSISTANT_TO_REPLY",
        summary: "Candidate Alex Vance passed technical screening; recruiter requests a 45-min final cultural interview this Friday.",
        suggestedAction: "Schedule candidate interview for Friday at 3:00 PM and send Google Meet link.",
        classificationReason: "Candidate coordination within established hiring blocks.",
        waitingForResponse: false,
        requiresAction: true,
        body: "Hi Alex,\n\nAlex Vance scored 96% on the take-home challenge and comes strongly recommended by their previous CTO. We need to book the final 45-minute founder interview before another offer lands. Is Friday between 2:00 PM and 4:30 PM viable?\n\nThanks,\nPriya"
      },
      {
        subject: "Flight Booking & Hotel Accommodations: Slush Helsinki 2026",
        sender: "Amara Okonjo (Corporate Travel Concierge)",
        senderEmail: "travel@concierge360.com",
        category: "Travel Arrangements",
        priority: "MEDIUM",
        isImportant: false,
        isRead: true,
        classification: "ASSISTANT_TO_REPLY",
        summary: "Travel concierge provided flight itineraries and hotel options for Slush Helsinki; awaits confirmation of preferred airline.",
        suggestedAction: "Confirm Business Class option on Finnair and Hotel St. George booking.",
        classificationReason: "Administrative logistics following executive travel guidelines.",
        waitingForResponse: false,
        requiresAction: true,
        body: "Hello,\n\nWe have placed 48-hour holds on the Finnair direct flight and Hotel St. George suite for the executive's trip to Slush Helsinki. Please confirm if we have permission to ticket against the corporate Amex.\n\nBest,\nAmara"
      },
      {
        subject: "Vendor Quote Revision: High-Performance GPU Cluster Hosting",
        sender: "Tom Hiddleston (Account Exec, Lambda Cloud)",
        senderEmail: "tom@lambdaclouds.net",
        category: "Vendor Communication",
        priority: "MEDIUM",
        isImportant: false,
        isRead: true,
        classification: "ASSISTANT_TO_REPLY",
        summary: "Lambda Cloud updated the 8x H100 GPU cluster annual quote with an additional 12% enterprise discount.",
        suggestedAction: "Forward reviewed specs and request revised invoice terms.",
        classificationReason: "Vendor coordination within pre-approved procurement parameters.",
        waitingForResponse: false,
        requiresAction: true,
        body: "Hi Alex,\n\nFollowing up on our call, we were able to get our VP to approve an additional 12% discount on the 8x H100 dedicated instances. Attached is the revised SOW. Please let me know if you would like me to dispatch the DocuSign.\n\nRegards,\nTom"
      },
      {
        subject: "Podcast Guest Invitation: 'The AI Operator' Episode #88",
        sender: "Elena Gomez (Producer, The AI Operator)",
        senderEmail: "producer@aioperator.show",
        category: "Media & PR",
        priority: "LOW",
        isImportant: false,
        isRead: true,
        classification: "ASSISTANT_TO_REPLY",
        summary: "Top 5 tech podcast invited client to speak on human-in-the-loop AI workflows. 45-min recording in December.",
        suggestedAction: "Check December media slot and respond with executive bio & press kit.",
        classificationReason: "Routine media request handling with standard press materials.",
        waitingForResponse: false,
        requiresAction: true,
        body: "Dear Founder,\n\nOur audience loved your recent thoughts on AI orchestration. We would love to host you on 'The AI Operator' for a 45-minute studio recording next month. Let us know if your assistant can coordinate a recording date.\n\nBest,\nElena Gomez"
      },
      {
        subject: "Office Lease Renewal & Parking Space Addendum",
        sender: "Colliers Commercial Property Management",
        senderEmail: "leasing@colliersproperties.com",
        category: "Administrative",
        priority: "LOW",
        isImportant: false,
        isRead: true,
        classification: "ASSISTANT_TO_REPLY",
        summary: "Building management needs confirmation on renewing the two dedicated EV charging parking spots for next year.",
        suggestedAction: "Confirm retention of EV parking spaces for the upcoming calendar year.",
        classificationReason: "Standard operational office renewal managed by assistant.",
        waitingForResponse: false,
        requiresAction: true,
        body: "Hello Suite 400 Tenant,\n\nPlease confirm whether you wish to maintain Parking Stalls #14 and #15 (EV-equipped) for the upcoming 12-month lease cycle ($450/month). Please respond before Friday.\n\nThank you,\nColliers Leasing"
      },

      // CLIENT TO REPLY (5 emails)
      {
        subject: "URGENT: Series A Term Sheet Signing & Escrow Wire",
        sender: "Marcus Vance (Managing Director, Horizon Capital)",
        senderEmail: "marcus@horizoncap.io",
        category: "Executive Decision",
        priority: "HIGH",
        isImportant: true,
        isRead: false,
        classification: "CLIENT_TO_REPLY",
        summary: "Marcus Vance sent the final $4.5M Series A Term Sheet requiring founder's direct signature and wire confirmation today by 5 PM PST.",
        suggestedAction: "Executive signature required in DocuSign before market close.",
        classificationReason: "Legal and financial commitment of high value strictly requiring client executive authority.",
        waitingForResponse: false,
        requiresAction: true,
        body: "Dear Founder,\n\nThe finalized revised Term Sheet for the $4.5M Series A round is now in DocuSign. We require your personal executive signature along with confirmation of the designated banking wire instructions before 5:00 PM PST today to initiate closing.\n\nPlease review and execute directly.\n\nBest,\nMarcus Vance"
      },
      {
        subject: "Client Partnership Agreement: Legal Clause 8.2 Inquiry",
        sender: "Elena Rostova (General Counsel, Acme Corp)",
        senderEmail: "elena.rostova@acmecorp.com",
        category: "Legal & Contracts",
        priority: "HIGH",
        isImportant: true,
        isRead: false,
        classification: "CLIENT_TO_REPLY",
        summary: "Acme Corp General Counsel seeks clarification on Clause 8.2 indemnity limits (capped vs uncapped) before signing.",
        suggestedAction: "Executive decision needed: specify whether indemnity is capped at 12 months fees.",
        classificationReason: "Contractual liability decision requiring executive client approval.",
        waitingForResponse: false,
        requiresAction: true,
        body: "Hello,\n\nRegarding the enterprise pilot partnership agreement, our legal team noticed an ambiguity in Clause 8.2 concerning intellectual property indemnity limits. Could your team clarify whether liability is capped at 12 months fees or uncapped? We await your response before clearing for signature.\n\nSincerely,\nElena Rostova"
      },
      {
        subject: "Acquisition Interest & Confidential Discussion: Project Titan",
        sender: "Christian Cole (VP Corporate Development, Oracle)",
        senderEmail: "christian.cole@oracle.com",
        category: "M&A Inquiry",
        priority: "HIGH",
        isImportant: true,
        isRead: false,
        classification: "CLIENT_TO_REPLY",
        summary: "Oracle VP of Corporate Development reached out regarding strategic corporate synergies and requested a confidential 1-on-1 call.",
        suggestedAction: "Review M&A strategic outreach and decide whether to engage under NDA.",
        classificationReason: "Confidential corporate acquisition inquiry requiring executive discretion.",
        waitingForResponse: false,
        requiresAction: true,
        body: "Confidential,\n\nOur executive team has been monitoring your developments in human-in-the-loop autonomous email workflows with great interest. We believe there could be immense strategic value in exploring closer alignment with our enterprise cloud suite. Would you be open to a confidential briefing under our standard mutual NDA?\n\nWarm regards,\nChristian Cole"
      },
      {
        subject: "Key Hire Offer Letter Approval: VP of Artificial Intelligence",
        sender: "Jordan Bell (Head of People)",
        senderEmail: "jordan@humanity.ai",
        category: "Executive Decision",
        priority: "HIGH",
        isImportant: true,
        isRead: true,
        classification: "CLIENT_TO_REPLY",
        summary: "Approval required for compensation package ($320k base + 1.2% equity) for incoming VP of AI.",
        suggestedAction: "Sign off on equity compensation package.",
        classificationReason: "Executive compensation and cap-table equity grant requires CEO authorization.",
        waitingForResponse: false,
        requiresAction: true,
        body: "Hi Evelyn,\n\nDr. Aris Thorne has verbally accepted our offer! Attached is the finalized offer letter with $320,000 base salary and 1.2% equity vesting over 4 years with a 1-year cliff. We need your signed authorization on the compensation matrix before sending it out.\n\nBest,\nJordan"
      },
      {
        subject: "Q3 Financial Audit Discrepancy & Revenue Recognition Sign-Off",
        sender: "Arthur Pendelton (Partner, KPMG Audit)",
        senderEmail: "apendelton@kpmg.com",
        category: "Finance & Audit",
        priority: "HIGH",
        isImportant: true,
        isRead: false,
        classification: "CLIENT_TO_REPLY",
        summary: "External auditor requires executive sign-off on deferred revenue treatment for multi-year enterprise contracts.",
        suggestedAction: "Review note on ASC 606 revenue recognition and approve management representation letter.",
        classificationReason: "Statutory audit representation letter requires client signature.",
        waitingForResponse: false,
        requiresAction: true,
        body: "Dear Evelyn,\n\nAs we finalize the Q3 review, we need your formal sign-off on the memo detailing the revenue recognition methodology for the 3-year enterprise contracts closed in September. Please find the representation letter attached for your review and execution.\n\nRegards,\nArthur Pendelton, CPA"
      },

      // NO REPLY NEEDED (4 emails)
      {
        subject: "AWS Monthly Cloud Infrastructure Invoice & Receipt - Oct 2026",
        sender: "Amazon Web Services Billing",
        senderEmail: "no-reply-aws@amazon.com",
        category: "Receipts & Billing",
        priority: "LOW",
        isImportant: false,
        isRead: true,
        classification: "NO_REPLY_NEEDED",
        summary: "AWS cloud hosting invoice receipt for October ($1,284.19). Paid automatically; purely informational.",
        suggestedAction: "Archived to company accounting records.",
        classificationReason: "Automated receipt notification with zero action required.",
        waitingForResponse: false,
        requiresAction: false,
        body: "Greetings from Amazon Web Services.\n\nYour invoice for the billing period October 1 - October 31, 2026 is now available. Your registered payment method was charged $1,284.19 USD. No further action is required from your end. You can inspect the detailed breakdown in AWS Cost Explorer."
      },
      {
        subject: "The Weekly SaaS Growth Digest #142",
        sender: "Lenny & SaaS Metrics Substack",
        senderEmail: "newsletter@substack.com",
        category: "Newsletter",
        priority: "LOW",
        isImportant: false,
        isRead: true,
        classification: "NO_REPLY_NEEDED",
        summary: "Weekly newsletter covering SaaS benchmarks and AI product strategies.",
        suggestedAction: "Archived.",
        classificationReason: "Mass newsletter publication.",
        waitingForResponse: false,
        requiresAction: false,
        body: "Here is your weekly roundup of product-led growth experiments, benchmark churn rates across B2B AI startups, and hiring trends for Q4."
      },
      {
        subject: "Stripe Payout Notification: $38,450.00 Sent to Silicon Valley Bank",
        sender: "Stripe Transfers",
        senderEmail: "notifications@stripe.com",
        category: "Finance Notification",
        priority: "LOW",
        isImportant: false,
        isRead: true,
        classification: "NO_REPLY_NEEDED",
        summary: "Daily settlement payout of $38,450.00 initiated to primary checking account.",
        suggestedAction: "None. System notification.",
        classificationReason: "Automated transaction alert.",
        waitingForResponse: false,
        requiresAction: false,
        body: "A payout of $38,450.00 is on its way to your SVB checking account ending in 4092. Estimated arrival: Tomorrow."
      },
      {
        subject: "GitHub Security Advisory: Dependabot alert resolved for axios",
        sender: "GitHub Security",
        senderEmail: "notifications@github.com",
        category: "System Alert",
        priority: "LOW",
        isImportant: false,
        isRead: true,
        classification: "NO_REPLY_NEEDED",
        summary: "Automated security alert confirmed resolved on humanity-email repository.",
        suggestedAction: "None required.",
        classificationReason: "Automated devops notification.",
        waitingForResponse: false,
        requiresAction: false,
        body: "Dependabot alert #14 in repository humanity-email has been closed as the vulnerable package was updated to 1.7.4."
      },

      // ACTION REQUIRED (3 emails)
      {
        subject: "ACTION REQUIRED: Delaware Annual Franchise Tax Filing Deadline",
        sender: "Firstbase Registered Agent Services",
        senderEmail: "compliance@firstbase.io",
        category: "Corporate Compliance",
        priority: "HIGH",
        isImportant: true,
        isRead: false,
        classification: "ASSISTANT_TO_REPLY",
        summary: "Delaware state corporate franchise tax filing due in 7 days. Penalty applies if unpaid.",
        suggestedAction: "Submit filing via Delaware Secretary of State portal.",
        classificationReason: "Regulatory deadline requiring immediate administrative action.",
        waitingForResponse: false,
        requiresAction: true,
        body: "URGENT COMPLIANCE NOTICE:\n\nYour Delaware annual report and franchise tax must be remitted before November 25. Total amount due: $450.00. Please complete the filing using your state entity file number."
      },
      {
        subject: "Wire Confirmation Needed: Silicon Valley Bank Commercial Line of Credit",
        sender: "Claire Dunphy (SVB Commercial Banking)",
        senderEmail: "cdunphy@svb.com",
        category: "Banking & Wire",
        priority: "HIGH",
        isImportant: true,
        isRead: false,
        classification: "CLIENT_TO_REPLY",
        summary: "Bank branch manager requires verbal or dual-authenticated callback to release $150k treasury transfer.",
        suggestedAction: "Execute dual-factor authorization via SVB Direct App.",
        classificationReason: "High-value banking transaction requiring executive authorization.",
        waitingForResponse: false,
        requiresAction: true,
        body: "Good morning,\n\nWe have received the wire transfer request for $150,000 destined for your payroll operating account. Due to fraud protection thresholds, we require the authorized signatory to confirm via secure callback or the SVB authenticator app."
      },
      {
        subject: "Expiring SSL Certificates: api.humanity.ai (Action within 48h)",
        sender: "Cloudflare Automated Cert Monitor",
        senderEmail: "ssl-alerts@cloudflare.com",
        category: "Infrastructure",
        priority: "HIGH",
        isImportant: true,
        isRead: false,
        classification: "ASSISTANT_TO_REPLY",
        summary: "Cloudflare edge SSL certificate for api.humanity.ai expires in 48 hours; DNS TXT token renewal pending.",
        suggestedAction: "Verify DNS record auto-renewal in Cloudflare dashboard.",
        classificationReason: "Critical technical uptime maintenance.",
        waitingForResponse: false,
        requiresAction: true,
        body: "Alert: The universal SSL certificate for api.humanity.ai will expire on Nov 19. Please ensure your CAA DNS records allow Let's Encrypt renewal."
      },

      // WAITING ON REPLY (3 emails)
      {
        subject: "Waiting on Feedback: Enterprise POC Architecture Specs",
        sender: "Rachel Adams (Solutions Architect, TechFlow)",
        senderEmail: "rachel@techflow.io",
        category: "Vendor & Tech",
        priority: "MEDIUM",
        isImportant: true,
        isRead: true,
        classification: "ASSISTANT_TO_REPLY",
        summary: "TechFlow Solutions Architect Rachel is awaiting confirmation on POC architecture schemas before their sprint kickoff.",
        suggestedAction: "Reply confirming receipt and promise technical review by 3 PM.",
        classificationReason: "Time-sensitive vendor check-in tracking a pending response.",
        waitingForResponse: true,
        requiresAction: true,
        body: "Hi team,\n\nJust pinging to check if you had a chance to look over the proof-of-concept system architecture diagram we sent on Monday? Our engineering sprint starts tomorrow, so having your sign-off on the API payload schemas will keep us on schedule.\n\nThanks,\nRachel"
      },
      {
        subject: "Follow-up: Pilot Pricing Proposal for Stripe Global Ops",
        sender: "Liam Gallagher (Strategic Sales Lead)",
        senderEmail: "liam.g@humanity.ai",
        category: "Sales Pipeline",
        priority: "MEDIUM",
        isImportant: false,
        isRead: true,
        classification: "ASSISTANT_TO_REPLY",
        summary: "Outreach sent to Stripe Procurement on Tuesday; awaiting counter-proposal or meeting slot.",
        suggestedAction: "Check calendar if Stripe team replies.",
        classificationReason: "Follow-up tracking external response.",
        waitingForResponse: true,
        requiresAction: false,
        body: "Hey Evelyn & Alex,\n\nI sent the $120k/yr pilot proposal to Stripe's Procurement lead yesterday. I've set a tracker on the email. I'll flag as soon as they ping back!"
      },
      {
        subject: "Healthcare Benefits Renewal Options for 2027",
        sender: "Maya Lin (Sequoia Benefits Broker)",
        senderEmail: "maya@sequoiabenefits.com",
        category: "HR & Benefits",
        priority: "LOW",
        isImportant: false,
        isRead: true,
        classification: "ASSISTANT_TO_REPLY",
        summary: "Benefits broker sent 3 health plan packages; waiting for team employee headcount survey.",
        suggestedAction: "Send employee survey results once collected.",
        classificationReason: "Awaiting survey compilation before finalizing with broker.",
        waitingForResponse: true,
        requiresAction: false,
        body: "Hi Alex,\n\nEnclosed are the Kaiser and Anthem plan tiers for 2027. Once you have the updated employee census from BambooHR, send it over and we will finalize the composite rates."
      }
    ];

    // Seed emails & conversations
    const createdEmails = [];
    for (let i = 0; i < rawEmails.length; i++) {
      const item = rawEmails[i];
      const receivedAt = new Date(Date.now() - (i + 1) * 1000 * 60 * 45); // spaced nicely in time

      const email = new Email({
        subject: item.subject,
        sender: item.sender,
        senderEmail: item.senderEmail,
        recipients: [clientUser.email, assistantUser.email],
        body: item.body,
        preview: item.body.substring(0, 100) + '...',
        clientId: clientUser._id,
        assistantId: assistantUser._id,
        classification: item.classification,
        originalAIClassification: item.classification,
        confidence: 0.96,
        classificationSource: 'AI',
        classificationReason: item.classificationReason,
        summary: item.summary,
        suggestedAction: item.suggestedAction,
        priority: item.priority,
        category: item.category,
        requiresAction: item.requiresAction,
        isImportant: item.isImportant,
        isRead: item.isRead,
        isArchived: false,
        isCompleted: false,
        waitingForResponse: item.waitingForResponse,
        receivedAt: receivedAt
      });
      await email.save();

      const conv = new Conversation({
        emailId: email._id,
        participants: [item.senderEmail, clientUser.email],
        messages: [
          {
            author: item.senderEmail,
            body: item.body,
            sentAt: receivedAt
          }
        ],
        lastMessageAt: receivedAt,
        status: 'ACTIVE'
      });
      await conv.save();

      email.conversationId = conv._id;
      await email.save();
      createdEmails.push(email);
    }

    // 3. Realistic Draft Replies (At least 5)
    // Draft 1: Board meeting reschedule (Pending Approval)
    const email1 = createdEmails.find(e => e.subject.includes("Q4 Board Meeting"));
    if (email1) {
      await Draft.create({
        emailId: email1._id,
        recipient: email1.senderEmail,
        subject: "Re: Q4 Board Meeting: Reschedule to Thursday?",
        body: "Hi Sarah,\n\nThursday at 2:00 PM EST works well for Dr. Evelyn Sterling. I have reserved the boardroom and updated the calendar invites with the secure video conference link.\n\nWarm regards,\nAlex Rivera\nExecutive Assistant to Dr. Evelyn Sterling",
        status: "PENDING_APPROVAL",
        createdBy: assistantUser._id,
        clientFeedback: ""
      });
    }

    // Draft 2: Coffee catchup in SF (Draft status)
    const email2 = createdEmails.find(e => e.subject.includes("Coffee & Product Strategy"));
    if (email2) {
      await Draft.create({
        emailId: email2._id,
        recipient: email2.senderEmail,
        subject: "Re: Coffee & Product Strategy Catchup in SF Next Week?",
        body: "Hi David,\n\nEvelyn would love to catch up while you're in SF. She has an opening next Tuesday at 3:30 PM at the Blue Bottle near 2nd & Howard. Let me know if that works for you and I'll send over a calendar invite.\n\nBest,\nAlex",
        status: "DRAFT",
        createdBy: assistantUser._id
      });
    }

    // Draft 3: Candidate Interview scheduling (Approved)
    const email3 = createdEmails.find(e => e.subject.includes("Senior Full-Stack AI Engineer"));
    if (email3) {
      await Draft.create({
        emailId: email3._id,
        recipient: email3.senderEmail,
        subject: "Re: Senior Full-Stack AI Engineer Candidate Interview: Alex Vance",
        body: "Hi Priya,\n\nFriday at 3:00 PM EST is locked in for Alex Vance's final interview with Evelyn. I've generated the Google Meet coordinates and dispatched calendar invites to both parties.\n\nThanks,\nAlex",
        status: "APPROVED",
        createdBy: assistantUser._id,
        approvedAt: new Date()
      });
    }

    // Draft 4: Series A Term Sheet (Requires Changes)
    const email4 = createdEmails.find(e => e.subject.includes("Series A Term Sheet"));
    if (email4) {
      await Draft.create({
        emailId: email4._id,
        recipient: email4.senderEmail,
        subject: "Re: URGENT: Series A Term Sheet Signing & Escrow Wire",
        body: "Dear Marcus,\n\nDr. Sterling has reviewed the terms. We are verifying the designated bank routing number with our treasury team and will execute in DocuSign by 4:00 PM PST today.\n\nSincerely,\nOffice of the CEO",
        status: "CHANGES_REQUESTED",
        createdBy: assistantUser._id,
        clientFeedback: "Please clarify that wire confirmation will be transmitted directly through SVB banking portal, not by email."
      });
    }

    // Draft 5: Legal Clause 8.2 clarification (Pending Approval)
    const email5 = createdEmails.find(e => e.subject.includes("Legal Clause 8.2"));
    if (email5) {
      await Draft.create({
        emailId: email5._id,
        recipient: email5.senderEmail,
        subject: "Re: Client Partnership Agreement: Legal Clause 8.2 Inquiry",
        body: "Hello Elena,\n\nTo confirm: intellectual property liability under Clause 8.2 is strictly capped at 12 months fees paid under the applicable SOW. Our outside legal counsel has aligned with this wording.\n\nBest regards,\nOffice of Dr. Evelyn Sterling",
        status: "PENDING_APPROVAL",
        createdBy: assistantUser._id
      });
    }

    // 4. Realistic Upcoming Meetings (4 meetings)
    await Meeting.create([
      {
        title: "Q4 Board of Directors & Investor Review",
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // in 2 days
        time: "2:00 PM - 3:30 PM EST",
        description: "Quarterly portfolio financial review, runway projections and product roadmap.",
        participants: [clientUser.email, "sjenkins@summitventures.com", "marcus@horizoncap.io"],
        meetingLink: "https://meet.google.com/hum-q4-board",
        status: "SCHEDULED",
        relatedEmailId: email1 ? email1._id : null
      },
      {
        title: "Product Strategy & Agent Architecture Coffee",
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // in 3 days
        time: "3:30 PM - 4:00 PM PST",
        description: "Informal founder sync on autonomous agent architectures and enterprise integration.",
        participants: [clientUser.email, "dkim@nexusai.dev"],
        meetingLink: "Blue Bottle Coffee, 2nd & Howard, SF",
        status: "SCHEDULED",
        relatedEmailId: email2 ? email2._id : null
      },
      {
        title: "Final Cultural Interview: Alex Vance (Lead AI Engineer)",
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4), // in 4 days
        time: "3:00 PM - 3:45 PM EST",
        description: "Founder discussion on system scaling, distributed LLM orchestration, and team culture.",
        participants: [clientUser.email, "alex.vance@candidate.io", "priya@venturetalent.io"],
        meetingLink: "https://meet.google.com/hum-eng-final",
        status: "SCHEDULED",
        relatedEmailId: email3 ? email3._id : null
      },
      {
        title: "KPMG Q3 Audit & Revenue Recognition Review",
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        time: "11:00 AM - 11:45 AM EST",
        description: "Review of ASC 606 revenue recognition memo with external audit partner.",
        participants: [clientUser.email, "apendelton@kpmg.com"],
        meetingLink: "https://meet.google.com/kpmg-audit-sync",
        status: "SCHEDULED"
      }
    ]);

    // 5. System Notifications for both users
    await Notification.create([
      {
        recipientId: clientUser._id,
        title: "Draft Awaiting Executive Sign-off",
        message: "Alex prepared a reply for Sarah Jenkins regarding the Q4 Board Meeting reschedule.",
        type: "APPROVAL",
        relatedEmailId: email1 ? email1._id : null,
        isRead: false
      },
      {
        recipientId: clientUser._id,
        title: "Urgent Series A Term Sheet",
        message: "Horizon Capital uploaded final $4.5M Series A term sheet in DocuSign requiring your signature.",
        type: "ALERT",
        relatedEmailId: email4 ? email4._id : null,
        isRead: false
      },
      {
        recipientId: clientUser._id,
        title: "Meeting Scheduled",
        message: "Candidate interview for Alex Vance (Lead AI Engineer) confirmed for Friday at 3:00 PM.",
        type: "MEETING",
        isRead: true
      },
      {
        recipientId: assistantUser._id,
        title: "Client Approval Feedback",
        message: "Dr. Sterling requested edits on the Horizon Capital wire confirmation draft.",
        type: "ACTION",
        relatedEmailId: email4 ? email4._id : null,
        isRead: false
      },
      {
        recipientId: assistantUser._id,
        title: "Delaware Franchise Tax Due",
        message: "Annual report compliance deadline approaching in 7 days.",
        type: "ALERT",
        isRead: false
      }
    ]);

    console.log(`✅ Demo data seeded successfully with ${createdEmails.length} emails, 5 drafts, 4 meetings, and 5 notifications!`);
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

module.exports = seedData;
