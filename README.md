# AI-Evidence Hub

AI-Evidence Hub is a proof-of-concept dashboard for an evidence support platform serving African Science Granting Councils. The platform is designed to help councils monitor grants, funding portfolios, research outputs, capacity-strengthening activity, MEL indicators, and shared knowledge resources in one place.

The current version is a clickable Next.js prototype that can be hosted on Vercel.

## What The Hub Supports

The Evidence Hub is intended to support Science Granting Councils with:

- Grant portfolio monitoring across countries and thematic areas
- Funding visibility by country, council, and programme area
- Project progress tracking for milestones, budgets, risk, and compliance
- Research output monitoring for publications, datasets, patents, and policy briefs
- Capacity-strengthening progress across institutions and individuals
- Alerts for delayed projects, reporting deadlines, funding calls, and meetings
- A knowledge assistant, Ask Hub, for querying grants, reports, policy documents, and MEL indicators

## Dashboard Modules

The prototype includes the following dashboard areas:

- **Summary metrics**: participating councils, active grants, total funding, projects in progress, research outputs, and capacity-building activity.
- **Grant portfolio**: thematic distribution of committed funding.
- **Funding by country**: Africa map using real country boundary data from Natural Earth through `world-atlas`.
- **Project progress**: status overview for on-track, at-risk, and delayed projects.
- **Alerts and notifications**: operational reminders and portfolio items requiring attention.
- **Research outputs**: publications, datasets, patents, and policy briefs over time.
- **Portfolio notes**: practical observations based on portfolio and reporting data.
- **Capacity strengthening**: training activity, institutions supported, and maturity scoring.
- **Quick access**: links to grant pipeline, reviewer database, policy documents, repositories, and training calendar.
- **Ask Hub**: a floating chatbot-style interface for querying institutional knowledge.

## Example Use Case

One example scenario is a regional maize disease surveillance programme involving councils in Kenya, Zambia, Malawi, Tanzania, and Zimbabwe.

The Hub would help council officers:

1. Track related grants and funded projects.
2. Monitor project milestones, budgets, and field reporting.
3. Review participation indicators such as gender and youth engagement.
4. Identify country-level funding and implementation patterns.
5. Prepare policy briefs based on project evidence.
6. Reuse project outputs as training material, guidance notes, and future call inputs.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- CSS modules through global app styling
- D3 Geo and TopoJSON for the Africa map
- `world-atlas` Natural Earth map data
- Vercel deployment

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start the production build locally:

```bash
npm run start
```

## Deployment

The project is configured as a standard Next.js application and can be deployed directly to Vercel.

Current production deployment:

```text
https://ai-evidence-hub.vercel.app
```

## Project Status

This is a proof of concept. The dashboard currently uses representative data for demonstration. A production version would connect to real grant management systems, document repositories, MEL databases, authentication, and council-specific data permissions.

