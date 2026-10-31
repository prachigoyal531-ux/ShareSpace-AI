import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini SDK with User-Agent header as required by skill
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey && !apiKey.startsWith('MY_') && !apiKey.includes('placeholder')) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// 1. AI Resource Matcher Endpoint
app.post('/api/ai/match-resources', async (req, res) => {
  const { query, availableResources } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  // If Gemini API is available, generate smart recommendations
  if (ai) {
    try {
      const resourceSummary = (availableResources || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        location: r.location,
        specs: r.specifications,
        status: r.status,
        eligibility: r.eligibilityRequirements
      }));

      const prompt = `You are the AI Assistant for ShareSpace AI at Nexora University (Jaipur, Rajasthan, India).
A student is requesting resources with this requirement:
"${query}"

Here is the list of college resources:
${JSON.stringify(resourceSummary, null, 2)}

Analyze their need and recommend 1 to 3 best matching resources.
Respond in valid JSON format only, matching this structure:
{
  "recommendationSummary": "Concise 1-2 sentence overview explaining how these resources fulfill the project needs.",
  "matchedResourceIds": ["id1", "id2"],
  "matchReasons": [
    {
      "resourceId": "id1",
      "reason": "Specific reason why this fits.",
      "prerequisitesNote": "Any induction or eligibility note the student should be aware of."
    }
  ],
  "suggestedDurationHours": 3
}`;

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI generation timed out')), 12000)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, ...parsed });
      } catch (parseError) {
        console.error('Failed to parse Gemini response JSON:', parseError);
      }
    } catch (apiError: any) {
      console.warn('Gemini API call failed, falling back to local heuristic matcher:', apiError.message);
    }
  }

  // Local Intelligent Heuristic Matcher Fallback
  const q = (query || '').toLowerCase();
  const matched = (availableResources || []).filter((r: any) => {
    const text = `${r.name} ${r.category} ${r.description} ${r.specifications?.join(' ')}`.toLowerCase();
    return q.split(' ').some((word: string) => word.length > 2 && text.includes(word));
  }).slice(0, 3);

  const matchedIds = matched.length > 0 ? matched.map((r: any) => r.id) : [availableResources?.[0]?.id].filter(Boolean);

  return res.json({
    success: true,
    recommendationSummary: `Based on your request "${query.slice(0, 60)}...", we matched ${matchedIds.length} technical resource(s) at Nexora University, Jaipur.`,
    matchedResourceIds: matchedIds,
    matchReasons: matchedIds.map((id: string) => {
      const item = (availableResources || []).find((r: any) => r.id === id);
      return {
        resourceId: id,
        reason: item ? `Matches required specs for ${item.category} (${item.name}).` : 'Recommended for project requirements.',
        prerequisitesNote: item?.eligibilityRequirements?.[0] || 'Standard campus ID required'
      };
    }),
    suggestedDurationHours: 4,
    source: ai ? 'gemini' : 'heuristic-fallback'
  });
});

// 2. AI Incident & Damage Report Summarizer Endpoint
app.post('/api/ai/incident-summary', async (req, res) => {
  const { resourceName, reportType, rawDescription, preCheckCondition, postCheckCondition } = req.body;

  if (ai) {
    try {
      const prompt = `You are a campus equipment safety specialist analyzing a reported condition/incident for:
Resource: ${resourceName}
Report Type: ${reportType}
Before Checkout Condition: ${preCheckCondition}
After Return Condition: ${postCheckCondition}
User Description: "${rawDescription}"

Generate a structured analysis.
Respond in valid JSON format only:
{
  "severity": "Low" | "Medium" | "High" | "Critical",
  "executiveSummary": "1-2 sentence professional summary for the Lab Manager",
  "potentialRootCause": "Brief likely cause (e.g. normal wear, improper transport, accidental impact)",
  "recommendedAction": "Actionable next steps (e.g. recalibration, cleaning, immediate repair, warranty replacement)",
  "estimatedDowntimeHours": 4
}`;

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI incident analysis timed out')), 12000)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);
      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, ...parsed });
    } catch (apiError: any) {
      console.warn('Gemini API incident summary failed, falling back:', apiError.message);
    }
  }

  // Heuristic Incident Analysis
  const desc = (rawDescription || '').toLowerCase();
  let severity = 'Low';
  if (desc.includes('broken') || desc.includes('shattered') || desc.includes('smoke') || desc.includes('spark')) {
    severity = 'Critical';
  } else if (desc.includes('crack') || desc.includes('jammed') || desc.includes('error') || desc.includes('damage')) {
    severity = 'High';
  } else if (desc.includes('scratch') || desc.includes('loose') || desc.includes('dirty') || desc.includes('missing cable')) {
    severity = 'Medium';
  }

  return res.json({
    success: true,
    severity,
    executiveSummary: `Reported issue on ${resourceName}: ${rawDescription ? rawDescription.slice(0, 100) : 'Condition check discrepancy noted.'}`,
    potentialRootCause: severity === 'Critical' ? 'Hardware trauma or power fault requiring technician quarantine.' : 'Wear from field usage or handling.',
    recommendedAction: severity === 'Low' ? 'Routine cleaning and return to active pool.' : 'Place in maintenance mode for technician bench check.',
    estimatedDowntimeHours: severity === 'Critical' ? 48 : severity === 'High' ? 24 : 4,
    source: 'heuristic-fallback'
  });
});

// 3. AI Conflict Detection & Resolution Helper
app.post('/api/ai/conflict-check', async (req, res) => {
  const { resourceName, requestedStart, requestedEnd, existingBookings } = req.body;

  const reqStart = new Date(requestedStart).getTime();
  const reqEnd = new Date(requestedEnd).getTime();

  const clashes = (existingBookings || []).filter((b: any) => {
    const bStart = new Date(b.startTime).getTime();
    const bEnd = new Date(b.endTime).getTime();
    return (reqStart < bEnd && reqEnd > bStart);
  });

  if (clashes.length === 0) {
    return res.json({
      hasConflict: false,
      message: `No conflicts detected. ${resourceName} is clear for this timeframe.`,
      bufferRecommendedMinutes: 30
    });
  }

  return res.json({
    hasConflict: true,
    message: `Scheduling overlap detected with ${clashes.length} existing booking(s).`,
    clashingBookings: clashes.map((c: any) => ({
      id: c.id,
      timeslot: `${new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(c.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      user: c.userName
    })),
    suggestedAlternative: 'Try starting 1 hour later or joining the waiting list to receive instant notification upon cancellation.'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ShareSpace AI API', time: new Date().toISOString() });
});

async function start() {
  const port = process.env.PORT || 3000;

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`ShareSpace AI server running on http://localhost:${port}`);
  });
}

start();
