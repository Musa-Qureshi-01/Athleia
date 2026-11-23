import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

// 1. Google Workspace (Official 4-Color Google 'G')
export function GoogleWorkspaceLogo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

// 2. Slack (Official 4-Color Slack Hashtag/Burst)
export function SlackLogo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.528 2.528 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
        fill="#E01E5A"
      />
      <path
        d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
        fill="#36C5F0"
      />
      <path
        d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"
        fill="#2EB67D"
      />
      <path
        d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
        fill="#ECB22E"
      />
    </svg>
  );
}

// 3. Atlassian Jira (Official Dual Diamond)
export function JiraLogo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <defs>
        <linearGradient id="jira-grad1" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0052CC" />
          <stop offset="100%" stopColor="#2684FF" />
        </linearGradient>
      </defs>
      <path
        d="M11.45 1.05a1.2 1.2 0 0 0-1.7 0L4.9 5.9a5.9 5.9 0 0 0 0 8.35l4.85 4.85 4.85-4.85a5.9 5.9 0 0 0 0-8.35L11.45 1.05z"
        fill="url(#jira-grad1)"
      />
      <path
        d="M19.1 8.7a5.9 5.9 0 0 0-8.35 0L5.9 13.55a1.2 1.2 0 0 0 0 1.7l4.85 4.85a1.2 1.2 0 0 0 1.7 0l6.65-6.65a5.9 5.9 0 0 0 0-8.35v-.4z"
        fill="#0052CC"
      />
    </svg>
  );
}

// 4. Confluence (Official Dual Waves)
export function ConfluenceLogo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M2.2 15.4c-.6.9-.5 2.1.2 2.8l3.4 3.4c.8.8 2 .9 2.9.2l5.4-4.2c-2.3-.4-4.6-1.5-6.3-3.2L2.2 15.4z"
        fill="#0052CC"
      />
      <path
        d="M21.8 8.6c.6-.9.5-2.1-.2-2.8l-3.4-3.4c-.8-.8-2-.9-2.9-.2L9.9 6.4c2.3.4 4.6 1.5 6.3 3.2l5.6-1z"
        fill="#2684FF"
      />
    </svg>
  );
}

// 5. GitHub (Official Octocat Invertocat)
export function GithubLogo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

// 6. Notion (Official Cube 'N')
export function NotionLogo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M4.2 3.5C4.7 3.9 4.9 4 5.9 4.1L18.4 5c.8 0 1 .4 1.2 1.1l2.4 13.2c.2 1.2-.2 1.7-1.4 1.8l-14.8.8c-1 .1-1.5-.3-1.8-1.2L2.3 5.4c-.3-1.2.2-1.9 1.9-1.9z"
        fill="#FFFFFF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.4 3.1c.9.1 1.2.3 2 .4l12.4.9c.9.1 1.2.6 1.4 1.4l2.4 13.5c.2 1.3-.2 1.9-1.5 2l-15.1.9c-1.1.1-1.6-.4-2-1.4L2.2 5.5c-.3-1.4.3-2.2 2.2-2.4zm2.8 3.8c-.8 0-1.1.1-1.6-.3l-.3-.3c-.2-.2-.2-.3.1-.3l2.8-.2c.8-.1 1.6-.1 2.4 0l8.7.6c.4 0 .5.3.3.6l-1.9 2.5c-.3.4-.7.5-1.2.4l-4.4-.3 5.2 8.7c.3.5.1.8-.4.8l-3.2.2c-.8 0-1.1-.1-1.6-.6L8.8 11.2v6.6c0 .7-.3 1-1.2 1.1l-1.6.1c-.3 0-.4-.2-.3-.5l.4-11.4c0-.2.2-.3.5-.3h.6z"
        fill="currentColor"
      />
    </svg>
  );
}

// 7. Meeting Notes / Granola / Fireflies (Acoustic Memo)
export function MeetingNotesLogo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="6" fill="#10B981" fillOpacity="0.12" />
      <path
        d="M7 10v4M10 7v10M14 5v14M17 8v8M20 11v2"
        stroke="#10B981"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 8. Glean Remote MCP (Official Glean Hexagonal Geometric Polygon)
export function GleanLogo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <defs>
        <linearGradient id="glean-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6A3D" />
          <stop offset="50%" stopColor="#FF9B26" />
          <stop offset="100%" stopColor="#1F45EC" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="url(#glean-g1)" fillOpacity="0.15" />
      <path
        d="M12 4L19 8V16L12 20L5 16V8L12 4Z"
        stroke="#FF7A00"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 8L16 10.5V14.5L12 16.5L8 14.5V10.5L12 8Z"
        fill="#1F45EC"
      />
    </svg>
  );
}

// 9. Upstash Context7 (Flash Bracket)
export function Context7Logo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="6" fill="#F59E0B" fillOpacity="0.12" />
      <path
        d="M5 8a3 3 0 0 1 3-3M5 16a3 3 0 0 0 3 3M19 8a3 3 0 0 0-3-3M19 16a3 3 0 0 1-3 3"
        stroke="#F59E0B"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13 5L8 13H14L11 19L17 11H11L13 5Z"
        fill="#F59E0B"
      />
    </svg>
  );
}

// 10. DeepWiki MCP (Neural Stack & Library)
export function DeepWikiLogo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="6" fill="#14B8A6" fillOpacity="0.12" />
      <path
        d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"
        stroke="#0D9488"
        strokeWidth="2"
      />
      <path
        d="M6 6h10M6 10h10M6 14h6"
        stroke="#0D9488"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="16" cy="14" r="2" fill="#14B8A6" />
    </svg>
  );
}

// 11. Mem0 MCP (Continuous Adaptive Memory Infinity Node)
export function Mem0Logo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="6" fill="#6366F1" fillOpacity="0.12" />
      <path
        d="M7.5 8C5.5 8 4 9.8 4 12s1.5 4 3.5 4c2.5 0 3.5-3 4.5-4s2-4 4.5-4c2 0 3.5 1.8 3.5 4s-1.5 4-3.5 4c-2.5 0-3.5-3-4.5-4s-2-4-4.5-4Z"
        stroke="#6366F1"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.5" fill="#6366F1" />
    </svg>
  );
}

// 12. EKOS (Enterprise Knowledge Compiler Causal Lattice)
export function EkosLogo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="6" fill="#F43F5E" fillOpacity="0.12" />
      <circle cx="6" cy="6" r="2.5" fill="#F43F5E" />
      <circle cx="18" cy="6" r="2.5" fill="#F43F5E" />
      <circle cx="12" cy="18" r="2.5" fill="#F43F5E" />
      <path
        d="M7.5 7.5L10.5 16M16.5 7.5L13.5 16M8.5 6h7"
        stroke="#F43F5E"
        strokeWidth="1.8"
      />
    </svg>
  );
}

// 13. Knowledge Raven MCP (Origami Raven)
export function KnowledgeRavenLogo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="6" fill="#8B5CF6" fillOpacity="0.12" />
      <path
        d="M4 16L11 4L18 10L20 8L15 19L11 15L7 20L4 16Z"
        fill="#8B5CF6"
      />
      <circle cx="13" cy="7" r="1" fill="#FFFFFF" />
    </svg>
  );
}

// 14. Company Database / PostgreSQL (Official Elephant/Cylinder)
export function CompanyDatabaseLogo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="6" fill="#336791" fillOpacity="0.12" />
      <ellipse cx="12" cy="6" rx="7" ry="2.5" fill="#336791" />
      <path
        d="M5 6v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6"
        stroke="#336791"
        strokeWidth="1.8"
      />
      <path
        d="M5 12v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6"
        stroke="#336791"
        strokeWidth="1.8"
      />
    </svg>
  );
}

// 15. Snowflake (Official Cyan Crystal)
export function SnowflakeLogo({ className = "w-6 h-6", size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <rect width="24" height="24" rx="6" fill="#29B5E8" fillOpacity="0.12" />
      <path
        d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M4.9 19.1L19.1 4.9"
        stroke="#29B5E8"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2" fill="#29B5E8" />
    </svg>
  );
}

// Dispatcher Component mapping ID to real SVG logo
export function McpLogoDispatcher({ id, size = 24, className = "" }: { id: string; size?: number; className?: string }) {
  switch (id) {
    case "google-workspace":
      return <GoogleWorkspaceLogo size={size} className={className} />;
    case "slack":
      return <SlackLogo size={size} className={className} />;
    case "jira":
      return <JiraLogo size={size} className={className} />;
    case "confluence":
      return <ConfluenceLogo size={size} className={className} />;
    case "github":
      return <GithubLogo size={size} className={className} />;
    case "notion":
      return <NotionLogo size={size} className={className} />;
    case "meeting-notes":
      return <MeetingNotesLogo size={size} className={className} />;
    case "glean-mcp":
      return <GleanLogo size={size} className={className} />;
    case "context7":
      return <Context7Logo size={size} className={className} />;
    case "deepwiki":
      return <DeepWikiLogo size={size} className={className} />;
    case "mem0":
      return <Mem0Logo size={size} className={className} />;
    case "ekos":
      return <EkosLogo size={size} className={className} />;
    case "raven":
      return <KnowledgeRavenLogo size={size} className={className} />;
    case "company-db":
      return <CompanyDatabaseLogo size={size} className={className} />;
    case "snowflake":
      return <SnowflakeLogo size={size} className={className} />;
    default:
      return (
        <div className="w-6 h-6 rounded bg-neutral-200 text-neutral-700 flex items-center justify-center font-bold text-xs">
          {id.charAt(0).toUpperCase()}
        </div>
      );
  }
}
