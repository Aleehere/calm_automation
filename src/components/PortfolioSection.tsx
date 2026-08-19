import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useAnimationFrame, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Zap, BrainCircuit, Globe, Database, Mail, Users, FileText,
  Bot, MessageSquare, BarChart3, ShoppingCart, Bell, Cpu,
  Network, CheckCircle, ArrowUpRight, ArrowRight, ArrowLeftRight, X, Play
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface WorkflowNode {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface ArchitectureNode {
  label: string;
  icon: React.ElementType;
  active?: boolean;
}

interface SystemArchitecture {
  nodes: ArchitectureNode[];
  direction?: 'left-to-right' | 'bidirectional';
}

interface SystemScreenshot {
  url: string;
  caption: string;
  description: string;
}

interface ImpactResult {
  title: string;
  description: string;
}

interface System {
  id: string;
  title: string;
  subtitle?: string;
  role?: string;
  description: string;
  stack: string[];
  results: string[];
  impactResults?: ImpactResult[];
  category: string;
  screenshot: string;
  previewImages?: string[];
  screenshots?: SystemScreenshot[];
  problem: string;
  howItWorks: string[];
  architectedItems?: string[];
  flow: WorkflowNode[];
  architecture: SystemArchitecture;
}

// ─── System Data ──────────────────────────────────────────────────────────────
const SYSTEMS: System[] = [
  {
    id: 'dual-crm-two-way-sync',
    title: 'Dual-CRM Two-Way Sync & Migration Suite',
    subtitle: 'Production synchronization architecture connecting two GoHighLevel environments across contacts, custom fields, tags, calendars, blocked slots, and deletion events.',
    role: 'CRM Integration & Automation Engineer',
    description: 'Bidirectional GoHighLevel synchronization suite for contacts, custom fields, tags, appointments, blocked slots, and deletions using n8n, Supabase, and LeadConnector APIs.',
    stack: [
      'N8N',
      'GOHIGHLEVEL',
      'SUPABASE',
      'REST API',
      'JAVASCRIPT',
      'GOOGLE SHEETS',
      'DATA MIGRATION',
      'LEADCONNECTOR',
    ],
    results: [
      '2 CRM instances synchronized',
      '43 custom fields mapped',
      'Contacts + calendars kept aligned',
      'Loop-safe bidirectional sync',
    ],
    impactResults: [
      {
        title: 'Two CRM Environments Synchronized',
        description: 'The architecture keeps data flowing bidirectionally between two separate GoHighLevel environments.',
      },
      {
        title: '43 Custom Fields Mapped',
        description: 'Custom-field schemas are mapped bidirectionally across different CRM structures.',
      },
      {
        title: 'Loop-Safe Architecture',
        description: 'Mirrored changes are prevented from endlessly re-triggering the opposite sync direction.',
      },
      {
        title: 'Contact + Calendar Consistency',
        description: 'Contacts, appointment state, blocked slots, and related CRM data remain aligned across systems.',
      },
      {
        title: 'API-Safe Processing',
        description: 'Throttling (11s delay) and controlled processing protect migration from GoHighLevel API burst limits.',
      },
      {
        title: 'Audit Visibility',
        description: 'CSV reporting provides operators with a practical way to inspect calendar synchronization health.',
      },
    ],
    category: 'CRM INTEGRATION',
    screenshot: '/images/dual-crm-sync/01-bulk-contact-migration.png',
    previewImages: [
      '/images/dual-crm-sync/01-bulk-contact-migration.png',
      '/images/dual-crm-sync/03-appointment-hybrid-sync.png',
      '/images/dual-crm-sync/02-exclusive-contact-migration.png',
      '/images/dual-crm-sync/04-appointment-audit-report.png',
      '/images/dual-crm-sync/05-blocked-slot-sync.png',
      '/images/dual-crm-sync/06-blocked-slot-audit.png',
    ],
    screenshots: [
      {
        url: '/images/dual-crm-sync/01-bulk-contact-migration.png',
        caption: '01 — Bulk Contact Migration & Merge Engine',
        description: 'n8n orchestration handling contacts found only in CRM A, only in CRM B, and contacts shared across both systems, with schema mapping, tag processing, API throttling, and synchronization logic.',
      },
      {
        url: '/images/dual-crm-sync/02-exclusive-contact-migration.png',
        caption: '02 — A → B / B → A Contact Migration',
        description: 'Dedicated migration paths parse incoming contact data, map tags and custom fields, create contacts in the opposite GoHighLevel instance, and throttle requests to stay within API limits.',
      },
      {
        url: '/images/dual-crm-sync/03-appointment-hybrid-sync.png',
        caption: '03 — Bidirectional Appointment Synchronization',
        description: 'Scheduled comparison engine synchronizing calendar appointments between both GoHighLevel environments while preventing mirrored events from being processed repeatedly.',
      },
      {
        url: '/images/dual-crm-sync/04-appointment-audit-report.png',
        caption: '04 — Appointment Sync Audit Report',
        description: 'Manual reporting workflow pulls mapped calendars, retrieves events from both systems, compares appointment records, and generates a CSV for mismatch auditing.',
      },
      {
        url: '/images/dual-crm-sync/05-blocked-slot-sync.png',
        caption: '05 — Blocked Calendar Slot Synchronization',
        description: 'Bidirectional workflow keeps calendar availability aligned across both CRM systems by detecting and applying blocked-slot changes.',
      },
      {
        url: '/images/dual-crm-sync/06-blocked-slot-audit.png',
        caption: '06 — Blocked Slot Audit Report',
        description: 'Reporting flow retrieves blocked calendar slots across mapped calendars and converts comparison data into a CSV for operational verification.',
      },
    ],
    problem: 'Consolidating two independent GoHighLevel environments created a significant data-consistency challenge. Contacts, tags, 43 custom fields, DND preferences, appointments, blocked calendar slots, and other CRM state needed to move between both systems without creating duplicates, losing information, exceeding API limits, or creating synchronization loops. The system therefore needed to perform an initial migration while also supporting ongoing bidirectional synchronization after migration.',
    howItWorks: [
      'Discover Data — Retrieve contact/calendar state from both GoHighLevel environments.',
      'Normalize Schemas — Map 43 custom-field IDs, tags, contact information, and CRM-specific fields.',
      'Compare State — Determine whether records exist in A, B, or both and identify differences.',
      'Resolve Conflicts — Apply contact merge rules, DND hierarchy, tag rules, and custom-field mapping.',
      'Execute Sync — Create, update, or delete target records through LeadConnector API with 11-second rate-limit throttling.',
      'Persist Mirror State — Write synchronization relationships and record mappings into Supabase.',
      'Prevent Sync Loops — Loop-killer logic ignores mirrored events originating from the sync system itself.',
      'Audit & Report — Generate CSV comparison reports for operators to verify 5-hour / 90-day rolling calendar sync health.',
    ],
    architectedItems: [
      'Bidirectional Contact Sync',
      '43 Custom Field Mappings',
      'Tag Union & Allowed List',
      'DND Preference Hierarchy',
      '5-Hour Calendar Sync Cadence',
      '90-Day Rolling Window',
      'Supabase State Storage',
      'Loop-Killer Logic',
      '11s API Throttling',
      'Blocked Slot Sync',
      'CSV Audit Reports',
      'Webhook Deletion Sync',
    ],
    flow: [
      { id: 'ghla', label: 'GHL A', icon: Database },
      { id: 'n8nsync', label: 'SYNC ENGINE', icon: Cpu },
      { id: 'state', label: 'SUPABASE STATE', icon: Network },
      { id: 'ghlb', label: 'GHL B', icon: Database },
      { id: 'verify', label: 'VERIFY', icon: CheckCircle },
    ],
    architecture: {
      direction: 'bidirectional',
      nodes: [
        { label: 'CRM A', icon: Database },
        { label: 'SYNC', icon: Cpu, active: true },
        { label: 'CRM B', icon: Database },
      ],
    },
  },
  {
    id: 'hvac-crm',
    title: 'Multi-Location HVAC CRM Automation',
    subtitle: 'Automated Workiz-to-GoHighLevel routing system for a multi-location HVAC company.',
    description: 'Automatically routes completed Workiz jobs to the correct GoHighLevel location and triggers branch-specific CRM workflows and follow-ups.',
    stack: ['GOHIGHLEVEL', 'WORKIZ', 'ZAPIER', 'LEADCONNECTOR', 'ZAPIER PATHS', 'CRM AUTOMATION'],
    results: [
      '100% hands-free workflow',
      'Correct location routing',
      'Reduced manual entry',
      'Faster closeout & invoicing',
    ],
    category: 'CRM AUTOMATION',
    screenshot: '/images/hvac-crm/hvac-routing-overview.png',
    previewImages: [
      '/images/hvac-crm/hvac-routing-overview.png',
      '/images/hvac-crm/hvac-leadconnector-config.png',
      '/images/hvac-crm/hvac-ghl-workflow.png',
    ],
    screenshots: [
      {
        url: '/images/hvac-crm/hvac-routing-overview.png',
        caption: 'Multi-Location Routing Architecture',
        description: 'Workiz completion events are split through Zapier Paths based on the HVAC location before being routed to the appropriate CRM workflow.',
      },
      {
        url: '/images/hvac-crm/hvac-leadconnector-config.png',
        caption: 'LeadConnector → GoHighLevel Routing',
        description: 'Each location path connects to the corresponding LeadConnector/GoHighLevel workflow.',
      },
      {
        url: '/images/hvac-crm/hvac-ghl-workflow.png',
        caption: 'GoHighLevel Branch Workflow',
        description: 'After routing, the selected GoHighLevel workflow handles the downstream CRM actions and customer follow-up automation.',
      },
    ],
    problem: 'The HVAC company operated several locations, each using its own GoHighLevel sub-account. Completed jobs needed to reach the correct account and trigger the correct branch workflow. Manual processing created paperwork delays, repetitive data entry, routing errors, and slower job closeout and invoicing.',
    howItWorks: [
      'Job Completed — A technician marks the HVAC job as "Done" in Workiz.',
      'Zapier Triggered — The completed-job information is automatically passed into Zapier.',
      'Location Identified — Zapier Paths determines which location/sub-account should receive the record.',
      'Correct GHL Workflow Selected — LeadConnector sends the information to the corresponding GoHighLevel account/workflow.',
      'CRM Updated — The appropriate records and workflow actions are triggered automatically.',
      'Follow-Up Executed — The correct location\'s customer follow-up runs without manual intervention.',
    ],
    flow: [
      { id: 'workiz', label: 'WORKIZ', icon: Zap },
      { id: 'zapier', label: 'ZAPIER', icon: Cpu },
      { id: 'router', label: 'ROUTER', icon: Network },
      { id: 'ghl', label: 'GHL', icon: Database },
      { id: 'followup', label: 'FOLLOW-UP', icon: Mail },
    ],
    architecture: {
      direction: 'left-to-right',
      nodes: [
        { label: 'WORKIZ', icon: Zap },
        { label: 'ROUTER', icon: Network, active: true },
        { label: 'GHL', icon: Database },
      ],
    },
  },
  {
    id: 'ghl-crm-architecture',
    title: 'Scalable GHL CRM & Lead Conversion Architecture',
    subtitle: 'Strategic GoHighLevel system architecture designed to map the complete customer journey before automation implementation.',
    role: 'Lead CRM Strategist & Automation Architect',
    description: 'End-to-end GoHighLevel architecture mapping lead capture, CRM pipelines, automation journeys, funnels, appointments, and follow-up systems before implementation.',
    stack: [
      'GOHIGHLEVEL',
      'CRM AUTOMATION',
      'FUNNELS',
      'LEAD MANAGEMENT',
      'LEAD CAPTURE',
      'DIGITAL STRATEGY',
      'PIPELINES',
      'AUTOMATION STRATEGY',
    ],
    results: [
      'End-to-end CRM roadmap',
      'Lead journeys fully mapped',
      'Scalable automation architecture',
      'Reduced lead leakage risk',
    ],
    impactResults: [
      {
        title: 'Complete CRM Roadmap',
        description: 'The customer journey was mapped before implementation.',
      },
      {
        title: 'Structured Lead Management',
        description: 'Pipeline stages, tags, automations, and follow-up logic were organized into one architecture.',
      },
      {
        title: 'Scalable Automation Design',
        description: 'The system was structured so additional workflows and funnels could fit within the same architecture.',
      },
      {
        title: 'Reduced Lead Leakage Risk',
        description: 'Lead movement, follow-up logic, and recovery paths were explicitly mapped rather than left disconnected.',
      },
      {
        title: 'Clear Implementation Blueprint',
        description: 'The mind maps gave the build process a clear technical and strategic roadmap.',
      },
    ],
    category: 'CRM ARCHITECTURE',
    screenshot: '/images/ghl-architecture/inbound-crm-journey.png',
    previewImages: [
      '/images/ghl-architecture/inbound-crm-journey.png',
      '/images/ghl-architecture/ghl-system-architecture.png',
      '/images/ghl-architecture/multi-funnel-conversion.png',
    ],
    screenshots: [
      {
        url: '/images/ghl-architecture/inbound-crm-journey.png',
        caption: '01 — Inbound Lead & CRM Journey',
        description: 'Detailed system blueprint mapping lead intake, pipeline stages, engagement automation, appointment reminders, no-show recovery, post-consult follow-up, tracking, dashboards, and conversion flow.',
      },
      {
        url: '/images/ghl-architecture/ghl-system-architecture.png',
        caption: '02 — GoHighLevel System Architecture',
        description: 'High-level map showing how the main GoHighLevel components are structured across custom values, calendars, funnels, automations, forms, and surveys.',
      },
      {
        url: '/images/ghl-architecture/multi-funnel-conversion.png',
        caption: '03 — Multi-Funnel Conversion Architecture',
        description: 'Conversion architecture showing multiple acquisition and sales journeys including lead magnets, webinars, CRM sales flows, high-ticket funnels, and downsell paths.',
      },
    ],
    problem: 'Many GoHighLevel setups are built one workflow at a time without first defining how the complete customer journey should operate. This can create disconnected automations, unclear pipeline ownership, inconsistent follow-ups, and potential lead leakage. The goal of this project was to design the complete CRM and automation architecture before implementation so every funnel, workflow, pipeline stage, calendar, tag, form, and follow-up sequence had a clearly defined purpose.',
    howItWorks: [
      'Map the Lead Journey — Defined how a lead enters the ecosystem and what should happen from initial capture through conversion.',
      'Define CRM Pipeline Stages — Mapped the stages leads should move through so sales activity and lead status remain visible.',
      'Design Automation Logic — Mapped triggers, conditional paths, nurture sequences, appointment communications, follow-up workflows, and recovery sequences.',
      'Structure Lead Tracking — Defined source tags, service-type tags, engagement tags, and status tracking to keep CRM records organized.',
      'Architect Appointment Journeys — Mapped appointment confirmations, reminders, cancellations, and no-show recovery.',
      'Design Funnel Journeys — Created architecture for different conversion paths including lead magnets, webinars, sales funnels, high-ticket funnels, and downsell journeys.',
      'Connect GHL Components — Defined how forms, calendars, custom values, surveys, funnels, automations, pipelines, and dashboards should work together.',
      'Create the Implementation Blueprint — Converted the complete strategy into visual mind maps that could be used as the roadmap for system implementation.',
    ],
    architectedItems: [
      'Lead Capture',
      'CRM Pipelines',
      'Lead Management',
      'Lead Source Tracking',
      'Service Type Tags',
      'Engagement Tracking',
      'Status Tracking',
      'Appointment Confirmation',
      'Appointment Reminders',
      'No-Show Recovery',
      'Post-Consult Follow-Up',
      'Lead Nurturing',
      'Forms',
      'Surveys',
      'Calendars',
      'Custom Values',
      'Funnels',
      'CRM Sales Funnel',
      'Lead Magnet Funnel',
      'Webinar Funnel',
      'High-Ticket Funnel',
      'Downsell Journey',
      'Dashboards',
      'Automation Logic',
    ],
    flow: [
      { id: 'capture', label: 'CAPTURE', icon: Zap },
      { id: 'crm', label: 'CRM', icon: Database },
      { id: 'automation', label: 'AUTOMATION', icon: Cpu },
      { id: 'funnel', label: 'FUNNEL', icon: Network },
      { id: 'convert', label: 'CONVERT', icon: CheckCircle },
    ],
    architecture: {
      direction: 'left-to-right',
      nodes: [
        { label: 'CAPTURE', icon: Zap },
        { label: 'CRM', icon: Database, active: true },
        { label: 'CONVERT', icon: CheckCircle },
      ],
    },
  },
  {
    id: 'ai-chatbot-lead-capture',
    title: 'AI Chatbot & Social Lead Capture System',
    subtitle: '24/7 GoHighLevel Conversation AI for Facebook and Instagram lead engagement, qualification, contact capture, and CRM routing.',
    role: 'AI Automation & CRM Engineer',
    description: '24/7 GoHighLevel Conversation AI that responds to Facebook and Instagram leads, qualifies prospects, captures contact data, and routes high-intent opportunities into the CRM automatically.',
    stack: [
      'GOHIGHLEVEL',
      'CONVERSATION AI',
      'FACEBOOK',
      'INSTAGRAM',
      'CRM AUTOMATION',
      'CHATBOT',
      'LEAD CAPTURE',
      'MARKETING AUTOMATION',
    ],
    results: [
      '24/7 automated responses',
      'Response time: hours → seconds',
      'Automated lead qualification',
      'CRM lead routing',
    ],
    impactResults: [
      {
        title: '24/7 Lead Engagement',
        description: 'Prospects receive an immediate automated response outside normal working hours.',
      },
      {
        title: 'Hours → Seconds',
        description: 'Initial lead response time was reduced from hours to seconds.',
      },
      {
        title: 'Automated Qualification',
        description: 'Conversation logic handles initial qualification without requiring manual intervention for every prospect.',
      },
      {
        title: 'Automatic Lead Capture',
        description: 'Contact information is captured during conversation and connected to the CRM.',
      },
      {
        title: 'CRM Routing',
        description: 'Qualified opportunities move into the appropriate sales process automatically.',
      },
      {
        title: 'Less Manual Follow-Up',
        description: 'The system handles repetitive early-stage engagement so the sales team can focus on stronger opportunities.',
      },
    ],
    category: 'CONVERSATIONAL AI',
    screenshot: '/images/ai-chatbot/fb-conversation-ai-full.png',
    previewImages: [
      '/images/ai-chatbot/fb-conversation-ai-full.png',
      '/images/ai-chatbot/fb-qualification-logic.png',
      '/images/ai-chatbot/ig-conversation-ai-workflow.png',
    ],
    screenshots: [
      {
        url: '/images/ai-chatbot/fb-conversation-ai-full.png',
        caption: '01 — Facebook Conversation AI — Full Workflow',
        description: 'Large-scale GoHighLevel conversational workflow using branching logic, messaging actions, qualification conditions, contact updates, and automated routing.',
      },
      {
        url: '/images/ai-chatbot/fb-qualification-logic.png',
        caption: '02 — Facebook Lead Qualification Logic',
        description: 'Detailed conversational branches handling prospect responses, conditions, messaging, contact actions, and lead progression.',
      },
      {
        url: '/images/ai-chatbot/ig-conversation-ai-workflow.png',
        caption: '03 — Instagram Conversation AI Workflow',
        description: 'Instagram conversational automation designed to handle incoming prospects and guide them through qualification and CRM routing.',
      },
    ],
    problem: 'Facebook and Instagram prospects could arrive at any time, but relying on manual responses created delays. By the time the sales team responded, some prospects could already have lost interest or moved on. The system needed to engage leads immediately, understand where they were in the conversation, collect relevant information, qualify them, and move suitable prospects into the CRM without requiring a team member to manage every initial interaction manually.',
    howItWorks: [
      'Social Lead Starts Conversation — A prospect sends a message through Facebook or Instagram.',
      'Conversation AI Responds — GoHighLevel Conversation AI begins the interaction automatically instead of waiting for manual intervention.',
      'Conversation Logic Evaluates Responses — Conditional branches determine the appropriate next action based on prospect answers and current state.',
      'Prospect Is Qualified — The workflow asks relevant questions and progresses the conversation through qualification paths.',
      'Contact Data Is Captured — Relevant prospect information is collected and associated with the CRM contact.',
      'CRM Record Is Updated — The workflow uses contact actions, conditions, tags/status logic to keep lead records synchronized.',
      'Qualified Lead Is Routed — Higher-intent leads move into the appropriate sales pipeline or next workflow stage.',
      'Automation Continues 24/7 — Initial engagement and qualification continues without waiting for a salesperson to respond manually.',
    ],
    architectedItems: [
      'Conditional Branching',
      'AI Conversation Engine',
      'Contact Actions & Mapping',
      'Qualification Paths',
      'CRM Pipeline Routing',
      'Multi-Channel Architecture',
    ],
    flow: [
      { id: 'social', label: 'SOCIAL', icon: MessageSquare },
      { id: 'aichat', label: 'AI CHAT', icon: Bot },
      { id: 'qualify', label: 'QUALIFY', icon: BrainCircuit },
      { id: 'lead', label: 'LEAD', icon: Database },
      { id: 'crm', label: 'CRM', icon: CheckCircle },
    ],
    architecture: {
      direction: 'left-to-right',
      nodes: [
        { label: 'SOCIAL', icon: MessageSquare },
        { label: 'AI', icon: Bot, active: true },
        { label: 'CRM', icon: Database },
      ],
    },
  },
  {
    id: 'lead-nurturing-automation',
    title: 'Multi-Channel Lead Nurturing Automation',
    subtitle: 'GoHighLevel workflow system for automated lead capture, tagging, notifications, timed nurturing, and follow-up.',
    role: 'CRM & Marketing Automation Engineer',
    description: 'GoHighLevel workflow that turns form submissions into automated tagging, internal alerts, timed email follow-ups, and structured lead nurturing sequences.',
    stack: [
      'GOHIGHLEVEL',
      'MARKETING AUTOMATION',
      'CRM AUTOMATION',
      'WORKFLOWS',
      'EMAIL AUTOMATION',
      'LEAD NURTURING',
      'FORMS',
    ],
    results: [
      'Automated lead follow-up',
      'Instant internal notifications',
      'Structured nurture sequence',
      'Reduced repetitive marketing tasks',
    ],
    impactResults: [
      {
        title: 'Automated Lead Processing',
        description: 'Form submissions automatically enter the configured workflow without manual delay.',
      },
      {
        title: 'Faster Internal Awareness',
        description: 'Internal notifications alert team members instantly upon new lead activity.',
      },
      {
        title: 'Consistent Follow-Up',
        description: 'Timing logic and email actions deliver a repeatable nurture experience for every lead.',
      },
      {
        title: 'Less Manual Marketing Work',
        description: 'Routine tagging, alerts, wait intervals, and email steps run automatically.',
      },
      {
        title: 'Structured Customer Journey',
        description: 'The workflow provides a defined progression from form capture through ongoing nurture.',
      },
    ],
    category: 'MARKETING AUTOMATION',
    screenshot: '/images/lead-nurturing/lead-nurturing-workflow.png',
    previewImages: [
      '/images/lead-nurturing/lead-nurturing-workflow.png',
    ],
    screenshots: [
      {
        url: '/images/lead-nurturing/lead-nurturing-workflow.png',
        caption: 'GoHighLevel Lead Nurturing Workflow',
        description: 'Form submission triggers automated tagging, internal notification, timing logic, email communication, and continued follow-up actions.',
      },
    ],
    problem: 'Manual marketing follow-up required the team to repeatedly monitor form submissions, organize new leads, notify internal staff, and remember when follow-up communication should be sent. The goal was to convert this repetitive process into a structured GoHighLevel workflow so each new lead automatically entered the appropriate customer journey as soon as the form was submitted.',
    howItWorks: [
      'Prospect Submits the Form — The automation starts when a new form submission is received.',
      'Lead Is Tagged — GoHighLevel automatically applies the appropriate tag so the contact can be identified and segmented.',
      'Team Is Notified — An internal notification alerts the relevant team member that a new prospect has entered the workflow.',
      'Timing Logic Starts — Wait steps control when the next marketing action should occur instead of sending every communication immediately.',
      'Email Follow-Up Is Sent — The lead receives the configured email communication automatically.',
      'Journey Continues — Additional wait and follow-up steps continue nurturing the prospect through the customer journey.',
    ],
    architectedItems: [
      'Form-Based Triggering',
      'Contact Tagging',
      'Internal Notifications',
      'Timed Follow-Up Logic',
      'Email Automation',
      'Lead Nurturing Sequences',
    ],
    flow: [
      { id: 'form', label: 'FORM', icon: FileText },
      { id: 'tag', label: 'TAG', icon: Zap },
      { id: 'automate', label: 'AUTOMATE', icon: Cpu },
      { id: 'email', label: 'EMAIL', icon: Mail },
      { id: 'followup', label: 'FOLLOW-UP', icon: CheckCircle },
    ],
    architecture: {
      direction: 'left-to-right',
      nodes: [
        { label: 'FORM', icon: FileText },
        { label: 'NURTURE', icon: Mail, active: true },
        { label: 'FOLLOW-UP', icon: CheckCircle },
      ],
    },
  },
  {
    id: 'lead-followup-system',
    title: 'Intelligent Multi-Channel Lead Follow-Up System',
    subtitle: 'GoHighLevel lead nurturing automation combining email, SMS, response detection, timeout handling, and behavior-based routing.',
    role: 'GoHighLevel Automation Specialist',
    description: 'Behavior-based GoHighLevel nurture workflow using email, SMS, reply detection, timeout logic, and conditional routing to automate lead follow-up.',
    stack: [
      'GOHIGHLEVEL',
      'EMAIL',
      'SMS',
      'CRM AUTOMATION',
      'MARKETING AUTOMATION',
      'LEAD NURTURING',
      'CONDITIONAL LOGIC',
      'WORKFLOWS',
    ],
    results: [
      'Automated email + SMS follow-up',
      'Reply-aware lead routing',
      'No-response recovery sequence',
      'Reduced manual follow-up',
    ],
    impactResults: [
      {
        title: 'Automated Multi-Channel Outreach',
        description: 'Email and SMS follow-ups are coordinated inside one behavior-driven workflow.',
      },
      {
        title: 'Reply-Aware Automation',
        description: 'The sequence reacts when a prospect responds instead of continuing to send the same messages blindly.',
      },
      {
        title: 'No-Response Recovery',
        description: 'Timeout branches allow non-responsive prospects to continue through additional nurturing steps.',
      },
      {
        title: 'Structured Lead Routing',
        description: 'Response conditions determine the next workflow path and relevant CRM/opportunity actions.',
      },
      {
        title: 'Reduced Manual Follow-Up',
        description: 'Repetitive outreach and response monitoring are handled automatically.',
      },
      {
        title: 'Consistent Lead Nurturing',
        description: 'Each prospect follows a defined workflow rather than relying on manual reminders.',
      },
    ],
    category: 'LEAD NURTURING',
    screenshot: '/images/lead-followup/lead-followup-workflow.png',
    previewImages: [
      '/images/lead-followup/lead-followup-workflow.png',
    ],
    screenshots: [
      {
        url: '/images/lead-followup/lead-followup-workflow.png',
        caption: 'GoHighLevel Behavior-Based Lead Nurturing Workflow',
        description: 'Multi-channel follow-up sequence combining email, SMS, reply monitoring, timeout handling, conditional branches, and CRM actions.',
      },
    ],
    problem: 'Manual lead follow-up can become inconsistent when the team has to remember when to send another email, when to text a prospect, whether the prospect already replied, and what action should happen next. The goal was to create a structured GoHighLevel automation that could continue nurturing prospects automatically while changing the workflow based on whether a contact responded.',
    howItWorks: [
      'Lead Enters the Follow-Up Sequence — A prospect enters the configured GoHighLevel nurturing workflow.',
      'Email Is Sent — The first automated email begins the outreach sequence.',
      'SMS Follow-Up Is Sent — The workflow uses another communication channel to continue engagement.',
      'Workflow Waits for a Reply — Instead of immediately continuing, the automation pauses and monitors for contact response.',
      'Reply vs Timeout Is Evaluated — The workflow branches depending on whether the contact responds or reaches the configured timeout period.',
      'Contact Response Is Checked — When a response is received, conditional logic determines the appropriate next route.',
      'Response-Based Branching — The workflow routes along positive/negative intent paths or fallback options.',
      'CRM Action Is Triggered — Relevant contact or opportunity actions (e.g. Update Opportunity to Unqualified) are applied.',
      'Non-Responders Continue Nurturing — If the lead does not reply, additional email/SMS follow-up continues through the next sequence.',
    ],
    architectedItems: [
      'Contact Reply Detection',
      'Timeout Handling',
      'Conditional Evaluation',
      'Positive / Negative Routing',
      'Continued Nurturing Sequences',
      'CRM & Opportunity Actions',
    ],
    flow: [
      { id: 'email_sms', label: 'EMAIL/SMS', icon: Mail },
      { id: 'wait', label: 'WAIT', icon: Bell },
      { id: 'response', label: 'RESPONSE', icon: MessageSquare },
      { id: 'router', label: 'ROUTER', icon: Network },
      { id: 'followup', label: 'FOLLOW-UP', icon: CheckCircle },
    ],
    architecture: {
      direction: 'left-to-right',
      nodes: [
        { label: 'OUTREACH', icon: Mail },
        { label: 'RESPONSE', icon: MessageSquare, active: true },
        { label: 'ROUTE', icon: Network },
      ],
    },
  },
  {
    id: 'lead-gen',
    title: 'AI Lead Generation Pipeline',
    description: 'Automated lead enrichment and qualification using Google Forms, Apollo, Apify, OpenAI, and Google Sheets.',
    stack: ['Make.com', 'OpenAI', 'Apify', 'Google Sheets', 'Apollo'],
    results: ['+300% lead volume', 'Saved 20 hrs/week', '2,000+ leads processed', 'Near-zero manual effort'],
    category: 'AI Pipeline',
    screenshot: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900',
    problem: 'Sales team was manually researching leads, spending 20+ hours per week on enrichment with inconsistent data quality and slow turnaround.',
    howItWorks: [
      'A Google Form submission triggers the pipeline',
      'Apify scrapes and enriches the lead data from multiple sources',
      'OpenAI analyzes and qualifies the lead based on ICP criteria',
      'Qualified leads are pushed to Google Sheets and the CRM automatically',
    ],
    flow: [
      { id: 'trigger', label: 'Form', icon: Zap },
      { id: 'scrape', label: 'Apify', icon: Globe },
      { id: 'ai', label: 'OpenAI', icon: BrainCircuit },
      { id: 'sheet', label: 'Sheets', icon: Database },
      { id: 'out', label: 'CRM', icon: CheckCircle },
    ],
    architecture: {
      direction: 'left-to-right',
      nodes: [
        { label: 'FORM', icon: Zap },
        { label: 'AI', icon: BrainCircuit, active: true },
        { label: 'CRM', icon: CheckCircle },
      ],
    },
  },
  {
    id: 'email-ai',
    title: 'AI Email & Meeting Automation',
    description: 'AI-driven system to analyze inbound emails, maintain context memory, check availability, book meetings, and send automated responses.',
    stack: ['n8n', 'AI Agents', 'Gmail API', 'Calendar API', 'GPT-4'],
    results: ['0 manual replies', '100% response rate', '3hr avg booking time', 'Context-aware replies'],
    category: 'AI Agent',
    screenshot: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=900',
    problem: 'Business was missing inbound leads due to slow email responses and manual calendar management — losing potential clients to faster competitors.',
    howItWorks: [
      'Inbound emails are captured and routed to the AI agent',
      'The agent reads the email, classifies intent, and checks memory context',
      'Availability is checked via Calendar API in real-time',
      'A personalized reply is drafted and sent — meeting links included',
    ],
    flow: [
      { id: 'email', label: 'Email', icon: Mail },
      { id: 'ai', label: 'AI Agent', icon: BrainCircuit },
      { id: 'cal', label: 'Calendar', icon: CheckCircle },
      { id: 'reply', label: 'Reply', icon: Mail },
    ],
    architecture: {
      direction: 'left-to-right',
      nodes: [
        { label: 'EMAIL', icon: Mail },
        { label: 'AI', icon: BrainCircuit, active: true },
        { label: 'BOOK', icon: CheckCircle },
      ],
    },
  },
  {
    id: 'order-mon',
    title: 'Unfulfilled Order Monitoring',
    description: 'n8n workflow to monitor Shopify orders every 3 hours and automatically flag unfulfilled orders older than 72 hours into Monday.com.',
    stack: ['n8n', 'Shopify', 'Monday.com', 'Slack'],
    results: ['0 missed orders', '100% visibility', 'Real-time Slack alerts', 'Reduced chargebacks'],
    category: 'Ops Automation',
    screenshot: '/unfulfilled-automation.png',
    problem: 'Operations team had no visibility into aging unfulfilled orders, causing customer complaints and chargebacks due to delayed fulfillment.',
    howItWorks: [
      'n8n polls Shopify every 3 hours for all open orders',
      'A filter checks which orders are older than 72 hours and unfulfilled',
      'Flagged orders are automatically created as tasks in Monday.com',
      'Ops team is notified via Slack with order details and urgency level',
    ],
    flow: [
      { id: 'shopify', label: 'Shopify', icon: ShoppingCart },
      { id: 'check', label: 'Filter', icon: Cpu },
      { id: 'monday', label: 'Monday', icon: BarChart3 },
      { id: 'slack', label: 'Alert', icon: Bell },
    ],
    architecture: {
      direction: 'left-to-right',
      nodes: [
        { label: 'SHOPIFY', icon: ShoppingCart },
        { label: 'MONITOR', icon: BarChart3, active: true },
        { label: 'ALERT', icon: Bell },
      ],
    },
  },
  {
    id: 'crm-sync',
    title: 'Airtable API Workflow Orchestration',
    description: 'Make.com automation using routers and iterators to sync, branch, and process Airtable records across multiple workflows.',
    stack: ['Make.com', 'Airtable', 'HTTP APIs', 'Webhooks'],
    results: ['5 systems synced', '99.9% uptime', '10k+ records/day', 'Zero data loss'],
    category: 'Data Pipeline',
    screenshot: '/airtable-workflow.png',
    problem: 'Data was siloed across Airtable, CRM, and external APIs with no real-time synchronization — causing inconsistent records and manual data entry.',
    howItWorks: [
      'A webhook or schedule triggers the orchestration workflow',
      'Router logic branches records into appropriate sub-flows',
      'Iterators process each record and apply transformation logic',
      'Processed data is synced back to all connected systems via APIs',
    ],
    flow: [
      { id: 'airtable', label: 'Airtable', icon: Database },
      { id: 'router', label: 'Router', icon: Network },
      { id: 'api', label: 'APIs', icon: Globe },
      { id: 'sync', label: 'Sync', icon: CheckCircle },
    ],
    architecture: {
      direction: 'left-to-right',
      nodes: [
        { label: 'AIRTABLE', icon: Database },
        { label: 'ROUTER', icon: Network, active: true },
        { label: 'API', icon: Globe },
      ],
    },
  },
  {
    id: 'contract',
    title: 'Contract Royalty Extraction',
    description: 'Extracted structured royalty data from contracts and generated Excel reports automatically using AI parsing.',
    stack: ['n8n', 'AI Parsing', 'Excel', 'Document AI'],
    results: ['95% accuracy', 'Saved 15 hrs/week', '500+ contracts processed', 'Automated reports'],
    category: 'AI Extraction',
    screenshot: '/contract-royalty.png',
    problem: 'Legal and finance teams were manually extracting royalty clauses from hundreds of contracts — a slow, error-prone process taking 15+ hours per week.',
    howItWorks: [
      'Contract PDFs are uploaded and ingested into the pipeline',
      'AI parses the document and extracts royalty-related clauses',
      'Data is structured into predefined fields and validated',
      'Excel reports are auto-generated and delivered to stakeholders',
    ],
    flow: [
      { id: 'doc', label: 'PDF', icon: FileText },
      { id: 'ai', label: 'AI Parse', icon: BrainCircuit },
      { id: 'struct', label: 'Structure', icon: Cpu },
      { id: 'excel', label: 'Excel', icon: BarChart3 },
    ],
    architecture: {
      direction: 'left-to-right',
      nodes: [
        { label: 'PDF', icon: FileText },
        { label: 'AI PARSE', icon: BrainCircuit, active: true },
        { label: 'EXCEL', icon: BarChart3 },
      ],
    },
  },
  {
    id: 'complaint',
    title: 'AI Complaint Classification',
    description: 'n8n workflow using AI Agents to analyze form submissions, classify complaints vs feature requests, create records, and notify teams.',
    stack: ['n8n', 'AI Agents', 'Slack', 'Notion'],
    results: ['98% accuracy', 'Instant triage', '0 manual reviews', 'Full audit trail'],
    category: 'AI Agent',
    screenshot: '/ai-complaint-classification.png',
    problem: 'Support team was manually reading and routing hundreds of submissions per week — causing delays, mislabeling, and missed critical issues.',
    howItWorks: [
      'Form submissions are captured and sent to the AI agent',
      'The agent analyzes tone, intent, and content of the submission',
      'It classifies the input as Bug, Feature Request, Complaint, or Inquiry',
      'A Notion record is created and the relevant team is notified via Slack',
    ],
    flow: [
      { id: 'form', label: 'Form', icon: Zap },
      { id: 'ai', label: 'AI Agent', icon: Bot },
      { id: 'classify', label: 'Classify', icon: BrainCircuit },
      { id: 'slack', label: 'Notify', icon: Bell },
    ],
    architecture: {
      direction: 'left-to-right',
      nodes: [
        { label: 'FORM', icon: Zap },
        { label: 'AI AGENT', icon: Bot, active: true },
        { label: 'SLACK', icon: Bell },
      ],
    },
  },
  {
    id: 'commerce',
    title: 'AI Commerce Assistant',
    description: 'Conversational AI commerce assistant that handles product queries and order flow via Telegram integrated with Shopify.',
    stack: ['AI Agents', 'Telegram', 'Shopify', 'OpenAI'],
    results: ['24/7 operation', '+40% conversion', '1k+ queries/day', 'Instant responses'],
    category: 'Conversational AI',
    screenshot: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=900',
    problem: 'E-commerce customers were abandoning carts due to unanswered product questions and slow support — especially outside business hours.',
    howItWorks: [
      'Customer sends a message on Telegram',
      'AI agent understands the query and fetches product/order data from Shopify',
      'A personalized, context-aware response is generated',
      'If needed, the agent escalates to human support automatically',
    ],
    flow: [
      { id: 'tele', label: 'Telegram', icon: MessageSquare },
      { id: 'ai', label: 'AI Agent', icon: BrainCircuit },
      { id: 'shopify', label: 'Shopify', icon: ShoppingCart },
      { id: 'reply', label: 'Response', icon: CheckCircle },
    ],
    architecture: {
      direction: 'left-to-right',
      nodes: [
        { label: 'TELEGRAM', icon: MessageSquare },
        { label: 'AI AGENT', icon: BrainCircuit, active: true },
        { label: 'SHOPIFY', icon: ShoppingCart },
      ],
    },
  },
  {
    id: 'followup',
    title: 'Automated Lead Follow-Up',
    description: 'Automated follow-up engine that triggers personalized responses based on CRM activity and engagement tracking.',
    stack: ['Make.com', 'CRM', 'Email API', 'Analytics'],
    results: ['+45% reply rate', 'Full automation', '5-step sequences', 'Behavior-triggered'],
    category: 'Sales Automation',
    screenshot: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=900',
    problem: 'Sales reps were forgetting to follow up with leads, or doing so at the wrong time — resulting in cold leads and lost deals.',
    howItWorks: [
      'CRM tracks lead activity and triggers the follow-up engine on key events',
      'The system selects the right message template based on lead stage',
      'Personalized emails are sent at optimal times in a 5-step sequence',
      'Engagement is tracked and sequences adapt based on response behavior',
    ],
    flow: [
      { id: 'crm', label: 'CRM', icon: Users },
      { id: 'trigger', label: 'Trigger', icon: Zap },
      { id: 'ai', label: 'Personalize', icon: BrainCircuit },
      { id: 'email', label: 'Email', icon: Mail },
    ],
    architecture: {
      direction: 'left-to-right',
      nodes: [
        { label: 'CRM', icon: Users },
        { label: 'AI ENGINE', icon: BrainCircuit, active: true },
        { label: 'EMAIL', icon: Mail },
      ],
    },
  },
];

// ─── Card Preview Panel ───────────────────────────────────────────────────────
const CardPreview = ({ system }: { system: System }) => {
  const PREVIEW_W = 320;
  const PREVIEW_H = 200;

  const images = system.previewImages && system.previewImages.length > 0
    ? system.previewImages
    : [system.screenshot];

  const [currentIdx, setCurrentIdx] = useState(0);

  // Reset carousel index whenever project system changes
  useEffect(() => {
    setCurrentIdx(0);
  }, [system.id]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [images]);

  const activeImage = images[currentIdx] || system.screenshot;

  return (
    <motion.div
      key={system.id}
      initial={{ opacity: 0, scale: 0.92, x: '-50%', y: '-46%' }}
      animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
      exit={{ opacity: 0, scale: 0.94, x: '-50%', y: '-48%' }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: PREVIEW_W,
        height: PREVIEW_H,
        position: 'absolute',
        left: '50%',
        top: '35%',
        zIndex: 40,
        pointerEvents: 'none',
      }}
      className="overflow-hidden rounded-2xl border border-primary/30 bg-[#010812]/95 backdrop-blur-2xl shadow-[0_0_40px_rgba(var(--primary),0.18),0_20px_60px_rgba(0,0,0,0.7)]"
    >
      <div className="absolute inset-0 scale-[1.05]">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={activeImage}
            alt={system.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#010812]/95 via-[#010812]/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 p-3 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/60 mb-0.5">{system.category}</p>
          <p className="text-[11px] font-bold text-white/90 leading-tight line-clamp-1">{system.title}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {images.length > 1 && (
            <span className="text-[8px] font-mono font-bold text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
              {String(currentIdx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
          )}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-widest text-primary/80">Live</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-primary/40" />
    </motion.div>
  );
};

// ─── Full Workflow (Modal) ────────────────────────────────────────────────────
const FullWorkflow = ({
  flow,
  onActiveChange,
}: {
  flow: WorkflowNode[];
  onActiveChange?: (idx: number) => void;
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [pulseProgress, setPulseProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const STEP_DURATION = 1100;
  const prevIdxRef = useRef(-1);

  useAnimationFrame(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const cycle = elapsed % (flow.length * STEP_DURATION);
    const newIdx = Math.floor(cycle / STEP_DURATION);
    setActiveIdx(newIdx);
    setPulseProgress((cycle % STEP_DURATION) / STEP_DURATION);
    if (newIdx !== prevIdxRef.current) {
      prevIdxRef.current = newIdx;
      onActiveChange?.(newIdx);
    }
  });

  return (
    <div className="flex items-center justify-center gap-0 w-full py-6 px-4">
      {flow.map((node, i) => {
        const isActive = i === activeIdx;
        const isPast = i < activeIdx;
        const Icon = node.icon;
        return (
          <div key={node.id} className="flex items-center flex-1 min-w-0">
            <div className="relative flex flex-col items-center gap-2 flex-shrink-0">
              <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500
                ${isActive ? 'bg-primary/20 border-primary/80 shadow-[0_0_28px_rgba(var(--primary),0.5)] scale-110'
                  : isPast ? 'bg-primary/10 border-primary/30' : 'bg-primary/[0.04] border-primary/10'}`}>
                <Icon size={22} className={`transition-colors duration-500 ${isActive ? 'text-primary' : isPast ? 'text-primary/60' : 'text-primary/25'}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                  </span>
                )}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-colors duration-500 ${isActive ? 'text-primary' : isPast ? 'text-foreground/50' : 'text-foreground/25'}`}>
                {node.label}
              </span>
            </div>
            {i < flow.length - 1 && (
              <div className="relative flex-1 mx-2 h-[2px] rounded overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 rounded" />
                {i === activeIdx && (
                  <motion.div className="absolute inset-y-0 left-0 bg-primary/70 rounded shadow-[0_0_8px_rgba(var(--primary),0.9)]"
                    style={{ width: `${pulseProgress * 100}%` }} />
                )}
                {i < activeIdx && <div className="absolute inset-0 bg-primary/30 rounded" />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── System Modal ─────────────────────────────────────────────────────────────
const SystemModal = ({ system, onClose }: { system: System; onClose: () => void }) => {
  const [activeNodeIdx, setActiveNodeIdx] = useState(0);
  const [imageGlowing, setImageGlowing] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<SystemScreenshot | null>(null);
  const glowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const displayImages: SystemScreenshot[] = system.screenshots && system.screenshots.length > 0
    ? system.screenshots
    : [{ url: system.screenshot, caption: system.title, description: system.description }];

  const currentMainImage = displayImages[activeImgIdx] || displayImages[0];

  // Reset modal scroll position to top whenever system changes
  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [system.id]);

  // Flash the image glow whenever the active node changes
  const handleActiveChange = useCallback((idx: number) => {
    setActiveNodeIdx(idx);
    setImageGlowing(true);
    if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
    glowTimerRef.current = setTimeout(() => setImageGlowing(false), 700);
  }, []);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Prevent layout shift when scrollbar disappears
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImg) {
          setLightboxImg(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handler);

    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      if (glowTimerRef.current) clearTimeout(glowTimerRef.current);
    };
  }, [onClose, lightboxImg]);

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex items-start justify-center p-3 sm:p-5 md:py-8 md:px-6 overflow-hidden"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/85 backdrop-blur-2xl"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal Panel */}
        <motion.div
          ref={modalContentRef}
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[calc(100vh-24px)] sm:max-h-[calc(100vh-40px)] md:max-h-[calc(100vh-64px)] overflow-y-auto rounded-3xl border border-primary/20 bg-[#020617]/98 backdrop-blur-3xl shadow-[0_0_80px_rgba(var(--primary),0.15),0_40px_100px_rgba(0,0,0,0.8)] z-10"
        >
          {/* Top edge glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-x-0 -top-px h-32 bg-gradient-to-b from-primary/[0.05] to-transparent pointer-events-none" />

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close project detail modal"
            className="absolute top-5 right-5 z-30 p-2.5 rounded-full bg-primary/10 border border-primary/20 text-foreground/60 hover:text-white hover:border-primary/50 hover:bg-primary/20 transition-all duration-300 shadow-lg"
          >
            <X size={18} />
          </button>

          <div className="p-6 md:p-9 flex flex-col gap-7">

            {/* ── Header ── */}
            <div className="flex items-start gap-4 pr-12">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60 bg-primary/5 border border-primary/15 rounded-full px-3 py-1">
                    {system.category}
                  </span>
                  {system.role && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/80 bg-primary/10 border border-primary/25 rounded-full px-3 py-1">
                      {system.role}
                    </span>
                  )}
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary/50">System Active</span>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gradient leading-tight">
                  {system.title}
                </h2>
                <p className="text-sm text-foreground/60 leading-relaxed max-w-2xl">
                  {system.subtitle || system.description}
                </p>
              </div>
            </div>

            {/* ── MAIN VISUAL: Workflow LEFT + Image RIGHT ── */}
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-4 items-stretch">

              {/* LEFT — Animated Workflow */}
              <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] overflow-hidden flex flex-col">
                <div className="px-5 pt-4 pb-1 border-b border-primary/[0.07] flex items-center justify-between">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40">Automation Flow</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[8px] font-bold text-primary/40 uppercase tracking-widest">Running</span>
                  </div>
                </div>
                <div className="flex-1 flex items-center">
                  <FullWorkflow flow={system.flow} onActiveChange={handleActiveChange} />
                </div>
                {/* Active node label */}
                <div className="px-5 pb-4 flex items-center gap-2">
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/30">Processing:</span>
                  <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest">
                    {system.flow[activeNodeIdx]?.label ?? '—'}
                  </span>
                </div>
              </div>

              {/* RIGHT — Project Image with reactive glow */}
              <motion.div
                className="relative rounded-2xl overflow-hidden border-2 transition-all duration-500 flex flex-col justify-between"
                style={{
                  borderColor: imageGlowing ? 'hsl(var(--primary) / 0.6)' : 'hsl(var(--primary) / 0.1)',
                  boxShadow: imageGlowing
                    ? '0 0 40px hsl(var(--primary) / 0.35), 0 0 80px hsl(var(--primary) / 0.12)'
                    : '0 0 0px transparent',
                }}
              >
                {/* Image */}
                <div className="relative flex-1 min-h-[220px] bg-black/40 overflow-hidden cursor-pointer" onClick={() => setLightboxImg(currentMainImage)}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentMainImage.url}
                      src={currentMainImage.url}
                      alt={currentMainImage.caption}
                      className="w-full h-full object-cover min-h-[200px]"
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </AnimatePresence>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent pointer-events-none" />

                  {/* Connected indicator — pulses when node fires */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <motion.div
                      animate={imageGlowing ? { scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] } : { scale: 1, opacity: 0.4 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#020617]/80 border border-primary/25 backdrop-blur-sm"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${imageGlowing ? 'bg-primary' : 'bg-primary/40'}`} />
                      <span className="text-[8px] font-black uppercase tracking-widest text-primary/70">
                        {imageGlowing ? system.flow[activeNodeIdx]?.label : 'Preview'}
                      </span>
                    </motion.div>
                  </div>

                  {/* Click to expand hint */}
                  <div className="absolute top-3 right-3">
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary/80 bg-[#020617]/80 border border-primary/20 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      Expand
                    </span>
                  </div>
                </div>

                {/* Sub-image tabs if multiple screenshots exist */}
                {displayImages.length > 1 && (
                  <div className="p-2 bg-[#020617]/95 border-t border-primary/10 flex items-center justify-center gap-2">
                    {displayImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImgIdx(idx)}
                        className={`text-[9px] font-bold px-2.5 py-1 rounded-md transition-all ${
                          idx === activeImgIdx
                            ? 'bg-primary/20 text-primary border border-primary/40'
                            : 'text-foreground/40 hover:text-foreground/80 hover:bg-primary/5'
                        }`}
                      >
                        0{idx + 1} View
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* ── PROJECT SCREENSHOTS GALLERY (If screenshots provided) ── */}
            {system.screenshots && system.screenshots.length > 0 && (
              <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-5 md:p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60">Project Screenshots & Proof</p>
                  <span className="text-[9px] font-bold text-foreground/40">{system.screenshots.length} Screenshots</span>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {system.screenshots.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxImg(s)}
                      className="group/ss relative rounded-xl border border-primary/15 bg-[#020617]/60 overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300 flex flex-col"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                        <img
                          src={s.url}
                          alt={s.caption}
                          className="w-full h-full object-cover group-hover/ss:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/ss:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="px-3 py-1.5 rounded-full bg-[#020617]/90 border border-primary/40 text-[9px] font-bold text-primary tracking-wider uppercase">
                            View Screenshot
                          </span>
                        </div>
                      </div>
                      <div className="p-3.5 flex flex-col gap-1.5 flex-1 bg-[#020617]/80">
                        <h4 className="text-xs font-extrabold text-foreground/90 group-hover/ss:text-primary transition-colors">
                          {s.caption}
                        </h4>
                        <p className="text-[11px] text-foreground/50 leading-relaxed font-light">
                          {s.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── WHAT WAS ARCHITECTED SECTION ── */}
            {system.architectedItems && system.architectedItems.length > 0 && (
              <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-5 md:p-6 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/60">What Was Architected</p>
                  <span className="text-[9px] font-bold text-foreground/40">{system.architectedItems.length} Components</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {system.architectedItems.map(item => (
                    <span key={item} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/5 text-foreground/80 border border-primary/15 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Details Grid ── */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-5 flex flex-col gap-3">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40">Problem Solved</p>
                <p className="text-sm text-foreground/70 leading-relaxed">{system.problem}</p>
              </div>

              <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-5 flex flex-col gap-3">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40">How I Approached It</p>
                <ol className="flex flex-col gap-2.5">
                  {system.howItWorks.map((step, i) => {
                    const parts = step.split(' — ');
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <div className="text-xs leading-relaxed">
                          {parts.length > 1 ? (
                            <>
                              <span className="font-extrabold text-foreground">{parts[0]}</span>
                              <span className="text-foreground/60 font-light"> — {parts[1]}</span>
                            </>
                          ) : (
                            <span className="text-foreground/65">{step}</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-5 flex flex-col gap-3">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40">Tech Stack & Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {system.stack.map(s => (
                    <span key={s} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-primary/8 text-primary/80 border border-primary/20">{s}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-primary/10 bg-primary/[0.02] p-5 flex flex-col gap-3">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40">Impact & Results</p>
                {system.impactResults ? (
                  <div className="flex flex-col gap-2.5">
                    {system.impactResults.map(ir => (
                      <div key={ir.title} className="p-2.5 rounded-xl bg-primary/5 border border-primary/10 flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-xs font-extrabold text-primary">{ir.title}</span>
                        </div>
                        <p className="text-[11px] text-foreground/60 font-light pl-3.5 leading-relaxed">{ir.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {system.results.map(r => (
                      <div key={r} className="flex items-center gap-2 p-2 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-[10px] font-bold text-primary/90">{r}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── CTA ── */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1 border-t border-primary/[0.08]">
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all duration-300">
                <Play size={14} />
                Request Case Study
              </button>
              <a href="#contact" onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full border border-primary/25 bg-primary/5 text-foreground/70 font-bold text-sm hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
                Build Something Similar
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-2xl"
            onClick={() => setLightboxImg(null)}
          >
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
            >
              <X size={24} />
            </button>
            <div
              className="max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-2xl border border-primary/30 bg-[#020617] shadow-2xl flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-full overflow-auto max-h-[78vh] flex items-center justify-center p-4 bg-black/60">
                <img src={lightboxImg.url} alt={lightboxImg.caption} className="max-w-full h-auto object-contain rounded-lg" />
              </div>
              <div className="w-full bg-[#020617] p-4 border-t border-primary/20 text-center">
                <h4 className="text-sm font-extrabold text-white">{lightboxImg.caption}</h4>
                {lightboxImg.description && <p className="text-xs text-foreground/60 mt-1 max-w-2xl mx-auto">{lightboxImg.description}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
};

// ─── Mini System Map (Card Architecture Strip) ────────────────────────────────
const MiniSystemMap = ({ architecture }: { architecture: SystemArchitecture }) => {
  const { nodes, direction = 'left-to-right' } = architecture;

  return (
    <div className="relative w-full flex items-center justify-between px-1 py-1">
      {nodes.map((node, i) => {
        const Icon = node.icon;
        const isActive = !!node.active;

        return (
          <div key={node.label} className="contents">
            {/* Node Box + Label */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0 min-w-[50px] max-w-[84px]">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                  isActive
                    ? 'bg-primary/20 border-primary/75 text-primary shadow-[0_0_14px_rgba(var(--primary),0.35)]'
                    : 'bg-primary/[0.04] border-primary/15 text-foreground/50 group-hover:border-primary/25'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-primary' : 'text-foreground/50 group-hover:text-foreground/75'} />
              </div>
              <span
                className={`text-[8.5px] font-bold uppercase tracking-wider text-center leading-tight truncate max-w-full px-0.5 ${
                  isActive ? 'text-primary font-black' : 'text-foreground/45 group-hover:text-foreground/65'
                }`}
              >
                {node.label}
              </span>
            </div>

            {/* Clean subtle connector */}
            {i < nodes.length - 1 && (
              <div className="flex-1 flex items-center justify-center min-w-[14px] px-1 -mt-4">
                <div className="h-px flex-1 bg-primary/20" />
                {direction === 'bidirectional' ? (
                  <ArrowLeftRight size={10} className="text-primary/50 flex-shrink-0 mx-1" />
                ) : (
                  <ArrowRight size={10} className="text-primary/35 flex-shrink-0 mx-1" />
                )}
                <div className="h-px flex-1 bg-primary/20" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── System Card ──────────────────────────────────────────────────────────────
interface SystemCardProps {
  system: System;
  index: number;
  onClick: (s: System) => void;
}

const SystemCard = ({ system, index, onClick }: SystemCardProps) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative ${isHovered ? 'z-30' : 'z-10'}`}
    >
      <div
        onClick={() => onClick(system)}
        className={`group relative flex flex-col rounded-2xl border backdrop-blur-xl overflow-hidden cursor-pointer
          transition-all duration-500
          ${isHovered ? 'border-primary/40 shadow-[0_0_40px_rgba(var(--primary),0.12)] -translate-y-1.5' : 'border-primary/10'}
          bg-[#020617]/90`}
      >
        {/* Click hint — appears on hover */}
        <div className={`absolute bottom-4 right-4 z-10 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 border border-primary/25">
            <Play size={8} className="text-primary" />
            <span className="text-[8px] font-black uppercase tracking-widest text-primary/80">Explore</span>
          </div>
        </div>

        {/* Top Header: Category Badge + Mini System Map */}
        <div className={`relative px-4 pt-3.5 pb-3 border-b transition-all duration-500 ${isHovered ? 'border-primary/15' : 'border-primary/[0.06]'}`}>
          <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.06)_0%,transparent_70%)]" />
          </div>

          {/* Category Badge Row */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/70 bg-primary/8 border border-primary/20 rounded-full px-2.5 py-0.5">
              {system.category}
            </span>
          </div>

          {/* Mini System Map */}
          <MiniSystemMap architecture={system.architecture} />
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-5 flex-1">
          <h3 className={`text-base font-extrabold leading-snug tracking-tight transition-colors duration-300 ${isHovered ? 'text-white' : 'text-foreground/90'}`}>
            {system.title}
          </h3>
          <p className="text-xs text-foreground/50 leading-relaxed font-light line-clamp-2">{system.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {system.stack.slice(0, 4).map(s => (
              <span key={s} className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/8 text-primary/70 border border-primary/15">{s}</span>
            ))}
            {system.stack.length > 4 && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md text-foreground/30">+{system.stack.length - 4}</span>
            )}
          </div>
          <div className={`mt-auto pt-4 border-t transition-colors duration-500 ${isHovered ? 'border-primary/20' : 'border-primary/[0.06]'}`}>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/40 mb-2">Key Results</p>
            <div className="flex flex-col gap-1">
              {system.results.slice(0, 4).map(r => (
                <div key={r} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className={`text-[10px] font-bold transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-foreground/60'}`}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={`absolute inset-x-0 bottom-0 h-[2px] transition-all duration-500 ${isHovered ? 'bg-primary/40 shadow-[0_0_12px_rgba(var(--primary),0.6)]' : 'bg-transparent'}`} />
      </div>

      {/* Floating Preview: rendered as absolute child inside card wrapper */}
      <AnimatePresence>
        {isHovered && <CardPreview system={system} />}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Section ──────────────────────────────────────────────────────────────────
const PortfolioSection = () => {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });
  const [activeSystem, setActiveSystem] = useState<System | null>(null);

  const handleClick = useCallback((system: System) => {
    setActiveSystem(system);
  }, []);

  return (
    <>
      <section id="portfolio" className="relative py-24 overflow-hidden bg-background">
        <div className="absolute top-1/4 left-1/3 w-[800px] h-[600px] bg-primary/[0.03] rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[500px] bg-secondary/[0.04] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/70">Production Systems</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gradient mb-5">
              Automation Systems<br className="hidden md:block" /> I've Built
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed font-light">
              Real-world workflows, AI systems, and scalable automation pipelines designed to eliminate manual work and drive measurable results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {SYSTEMS.map((system, i) => (
              <SystemCard key={system.id} system={system} index={i} onClick={handleClick} />
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }} className="mt-14 flex justify-center">
            <a href="#contact" className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-primary/25 bg-primary/5 text-sm font-bold text-foreground/70 hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
              Want a custom system built?
              <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* System Modal */}
      <AnimatePresence>
        {activeSystem && <SystemModal system={activeSystem} onClose={() => setActiveSystem(null)} />}
      </AnimatePresence>
    </>
  );
};

export default PortfolioSection;
