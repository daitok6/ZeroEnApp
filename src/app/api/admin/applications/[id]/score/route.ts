import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

const SCORING_SYSTEM_PROMPT = `You are a strict evaluator for ZeroEn — a service that builds free MVPs for founders in exchange for equity and revenue share. Your job is to score client applications to protect the operator's time.

Score each of 4 dimensions from 1 to 5:

### 1. Idea Viability (score_viability)
- 5: Clear monetization, proven market demand, existing competitors validate the space
- 4: Strong potential, monetization path exists but unproven
- 3: Viable but niche, or unclear how it makes money
- 2: Weak market signal, "nice to have" not "must have"
- 1: No clear path to revenue, solution looking for a problem

### 2. Founder Commitment (score_commitment)
- 5: Full-time on this, domain expertise, existing audience/network, skin in the game
- 4: Serious side project, relevant experience, willing to invest time and resources
- 3: Interested but untested, no track record, seems genuine
- 2: Vague interest, wants someone else to do everything, no domain knowledge
- 1: Tire-kicker, unrealistic expectations, wants a magic button

### 3. Technical Feasibility (score_feasibility)
- 5: Straightforward MVP, fits perfectly in Next.js + Supabase, can build in 1-2 weeks
- 4: Achievable MVP, some complexity but manageable, 2-4 weeks
- 3: Moderate complexity, may need external APIs or custom logic, 4-6 weeks
- 2: High complexity, needs specialized infrastructure, 6+ weeks
- 1: Not feasible as an MVP, requires fundamental R&D, or needs tech outside our stack

### 4. Market Potential (score_market)
- 5: Large TAM, growing market, clear path to scale, strong revenue potential for equity upside
- 4: Good market size, growth potential, realistic scaling path
- 3: Moderate market, could work but limited upside
- 2: Small niche, limited growth potential, equity likely low value
- 1: Tiny market or oversaturated, minimal equity upside

Decision thresholds: 15-20 = ACCEPT, 12-14 = BORDERLINE, below 12 = REJECT

Do not inflate scores to be nice. Be objective and protect the operator's time.

Respond ONLY with valid JSON in this exact shape:
{
  "score_viability": <1-5>,
  "score_commitment": <1-5>,
  "score_feasibility": <1-5>,
  "score_market": <1-5>,
  "rationale": {
    "viability": "<1-2 sentence justification>",
    "commitment": "<1-2 sentence justification>",
    "feasibility": "<1-2 sentence justification>",
    "market": "<1-2 sentence justification>"
  },
  "recommendation": "<ACCEPT|BORDERLINE|REJECT>",
  "summary": "<2-3 sentence overall assessment including key risks>"
}`;

export async function POST(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Fetch application
  const { data: app, error: fetchError } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !app) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }

  // Build user message
  const userMessage = `Please score this application:

**Idea:** ${app.idea_name}
**Description:** ${app.idea_description}
**Problem solved:** ${app.problem_solved}
**Target users:** ${app.target_users}
**Competitors:** ${app.competitors || 'None mentioned'}
**Monetization plan:** ${app.monetization_plan}

**Founder:** ${app.founder_name}
**Background:** ${app.founder_background}
**Commitment level:** ${app.founder_commitment}
**LinkedIn:** ${app.linkedin_url || 'Not provided'}`;

  // Call Claude
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let scoreData: {
    score_viability: number;
    score_commitment: number;
    score_feasibility: number;
    score_market: number;
    rationale: {
      viability: string;
      commitment: string;
      feasibility: string;
      market: string;
    };
    recommendation: string;
    summary: string;
  };

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SCORING_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    // Strip markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    scoreData = JSON.parse(cleaned);
  } catch (err) {
    console.error('Claude scoring error:', err);
    return NextResponse.json({ error: 'AI scoring failed. Please try again.' }, { status: 500 });
  }

  // Validate scores are in range
  const scores = [scoreData.score_viability, scoreData.score_commitment, scoreData.score_feasibility, scoreData.score_market];
  if (scores.some((s) => typeof s !== 'number' || s < 1 || s > 5)) {
    return NextResponse.json({ error: 'Invalid scores returned by AI' }, { status: 500 });
  }

  // Save to DB
  const rationale = {
    viability: scoreData.rationale.viability,
    commitment: scoreData.rationale.commitment,
    feasibility: scoreData.rationale.feasibility,
    market: scoreData.rationale.market,
    recommendation: scoreData.recommendation,
    summary: scoreData.summary,
  };

  const { error: updateError } = await supabase
    .from('applications')
    .update({
      score_viability: scoreData.score_viability,
      score_commitment: scoreData.score_commitment,
      score_feasibility: scoreData.score_feasibility,
      score_market: scoreData.score_market,
      score_rationale: rationale,
      status: app.status === 'pending' ? 'reviewing' : app.status,
    })
    .eq('id', id);

  if (updateError) {
    console.error('DB update error:', updateError);
    return NextResponse.json({ error: 'Failed to save scores' }, { status: 500 });
  }

  return NextResponse.json({
    score_viability: scoreData.score_viability,
    score_commitment: scoreData.score_commitment,
    score_feasibility: scoreData.score_feasibility,
    score_market: scoreData.score_market,
    score_rationale: rationale,
  });
}
