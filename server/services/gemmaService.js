/**
 * Gemma AI Service for MoodUI Studio
 * Communicates with Google AI API for Gemma 4 / Gemini models with full fallback
 * to the High-Fidelity Local Synthesis Engine when credentials are not yet configured.
 */

import { validateComponentTree, validatePatch } from '../schema/validator.js';
import { STARTER_TEMPLATES } from '../schema/defaultTemplates.js';

const DEFAULT_MODEL = 'gemma-4-31b-it';

export class GemmaService {
  constructor() {
    this.apiEndpoint = process.env.GEMMA_API_ENDPOINT || 'https://generativelanguage.googleapis.com/v1beta';
  }

  // Read API key lazily so dotenv timing doesn't matter
  get apiKey() {
    return process.env.GEMINI_API_KEY || process.env.GEMMA_API_KEY || '';
  }

  // Read model lazily too
  get model() {
    return process.env.GEMMA_MODEL || DEFAULT_MODEL;
  }

  isConfigured(apiKeyOverride = null) {
    const key = apiKeyOverride || this.apiKey;
    return Boolean(key && key.trim().length > 5);
  }

  /**
   * Helper to perform request to Google AI Generative Language API
   */
  async callGoogleAI(prompt, systemInstruction = '', modelOverride = null, apiKeyOverride = null) {
    const apiKey = apiKeyOverride || this.apiKey;
    if (!apiKey || apiKey.trim().length <= 5) {
      throw new Error('Gemma API credentials not configured. Configure GEMMA_API_KEY in server/.env or Studio Settings.');
    }

    const model = modelOverride || this.model;
    const url = `${this.apiEndpoint}/models/${model}:generateContent?key=${apiKey}`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192
      }
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try { errorJson = JSON.parse(errorText); } catch (_) {}
      const errMsg = errorJson?.error?.message || `Google AI API responded with HTTP ${response.status}: ${errorText}`;
      throw new Error(errMsg);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const contentPart = parts.find(p => !p.thought) || parts[parts.length - 1];
    const textOutput = contentPart?.text;

    if (!textOutput) {
      throw new Error('Google AI API returned empty content');
    }

    return textOutput;
  }

  /**
   * POST /api/design - Generate structured UI from user prompt, palette, and mood board
   */
  async generateDesign({ prompt, palette, moodBoard = [], designPreferences = {}, model = null, apiKeyOverride = null }) {
    if (this.isConfigured(apiKeyOverride)) {
      try {
        const systemInstruction = `You are MoodUI Studio's AI layout architect powered by Gemma.
Output ONLY valid JSON representing an array of structured components following the schema:
[
  {
    "id": "unique-id",
    "type": "navbar" | "hero" | "features" | "card-grid" | "testimonials" | "form" | "cta" | "footer",
    "props": { ... },
    "style": { ... }
  }
]
Always use cohesive modern design, clean responsive spacing, and realistic placeholder copy.`;

        const moodContext = moodBoard.length > 0 
          ? `User uploaded ${moodBoard.length} reference inspiration items: ${moodBoard.map(m => m.title || m.caption || 'Visual reference').join(', ')}.`
          : '';

        const userPrompt = `Generate a modern, responsive website interface specification.
User Request: "${prompt}"
Palette Preference: ${palette?.name || 'Modern Dark'} (Primary: ${palette?.primary || '#3b82f6'}, Background: ${palette?.background || '#0f172a'})
${moodContext}
Preferences: ${JSON.stringify(designPreferences)}`;

        const rawJson = await this.callGoogleAI(userPrompt, systemInstruction, model, apiKeyOverride);
        let parsed;
        try {
          parsed = JSON.parse(rawJson);
        } catch (err) {
          // Attempt markdown json cleanup
          const match = rawJson.match(/```json\s*([\s\S]*?)\s*```/);
          if (match) {
            parsed = JSON.parse(match[1]);
          } else {
            throw new Error(`Failed to parse AI output as JSON: ${err.message}`);
          }
        }

        const components = Array.isArray(parsed) ? parsed : (parsed.components || []);
        const validation = validateComponentTree(components);
        if (!validation.valid) {
          throw new Error(`AI generated invalid component schema: ${validation.error}`);
        }

        return {
          success: true,
          provider: 'google-ai',
          model: model || this.model,
          aiActive: true,
          components,
          palette: palette || { name: 'dark-professional' },
          message: 'UI successfully generated using Gemma 4 model.'
        };
      } catch (aiError) {
        console.warn('Gemma AI API call encountered an error. Falling back to Local High-Fidelity Engine:', aiError.message);
        // Fallback gracefully to local generator with clear reporting
        const localResult = this.generateLocalDesign({ prompt, palette, moodBoard, designPreferences });
        localResult.aiActive = false;
        localResult.warning = `AI API Error: ${aiError.message}. Synthesized using Local Expert Engine.`;
        return localResult;
      }
    }

    // Local Demonstration / Offline Mode
    return this.generateLocalDesign({ prompt, palette, moodBoard, designPreferences });
  }

  /**
   * Local High-Fidelity Design Generator
   * Understands keywords, moodboard context, and palette to synthesize authentic structured AST.
   */
  generateLocalDesign({ prompt = '', palette, moodBoard = [], designPreferences = {} }) {
    const lower = prompt.toLowerCase();
    let templateKey = 'portfolio';

    if (lower.includes('learn') || lower.includes('college') || lower.includes('course') || lower.includes('edu') || lower.includes('school') || lower.includes('academy')) {
      templateKey = 'learning';
    } else if (lower.includes('saas') || lower.includes('app') || lower.includes('startup') || lower.includes('ai') || lower.includes('platform') || lower.includes('tool')) {
      templateKey = 'saas';
    }

    const baseTemplate = JSON.parse(JSON.stringify(STARTER_TEMPLATES[templateKey]));
    const components = baseTemplate.components;

    // Adapt hero title and copy to user request
    const hero = components.find(c => c.type === 'hero');
    if (hero) {
      if (prompt.trim()) {
        const titleMatch = prompt.replace(/^(create|build|make|generate|design)\s+(a|an)?/i, '').trim();
        hero.props.title = titleMatch.charAt(0).toUpperCase() + titleMatch.slice(1);
      }
      if (moodBoard.length > 0 && moodBoard[0].url) {
        hero.props.imageUrl = moodBoard[0].url;
        hero.props.imageAlt = moodBoard[0].title || 'User inspiration image';
      }
    }

    return {
      success: true,
      provider: 'local-expert-engine',
      model: 'local-deterministic-v1',
      aiActive: false,
      components,
      palette: palette || { name: baseTemplate.paletteName },
      message: 'Interface synthesized with Local High-Fidelity Engine. To connect Gemma 4, set GEMMA_API_KEY.',
      statusMessage: this.isConfigured() ? 'Gemma configured' : 'Local Mode: GEMMA_API_KEY not configured. Full local editing enabled.'
    };
  }

  /**
   * POST /api/refine - Natural language refinement with component-level edits
   * Uses Gemma AI when configured, falls back to deterministic local engine.
   */
  async refineDesign({ prompt, components, palette, selectedId = null, model = null, apiKeyOverride = null }) {
    // Attempt AI-powered refinement when credentials are available
    if (this.isConfigured(apiKeyOverride)) {
      try {
        const systemInstruction = `You are MoodUI Studio's AI refinement engine powered by Gemma.
The user has an existing website specification (component AST) and wants to modify it.
Output ONLY valid JSON as an array of components following the SAME schema as the input.
Preserve all component IDs. Only modify what the user specifies.
Each component has: { "id": string, "type": string, "props": object, "style": object }
Make targeted surgical changes only. Keep all other components unchanged.`;

        const userPrompt = `Current Website AST:
${JSON.stringify(components, null, 2)}

User Refinement Request: "${prompt}"
${selectedId ? `Focused Component ID: "${selectedId}"` : ''}
Active Palette: ${JSON.stringify({ primary: palette?.primary, background: palette?.background, name: palette?.name })}

Return the complete updated component array as JSON, preserving unchanged components exactly.`;

        const rawJson = await this.callGoogleAI(userPrompt, systemInstruction, model, apiKeyOverride);
        let parsed;
        try {
          parsed = JSON.parse(rawJson);
        } catch (err) {
          const match = rawJson.match(/```json\s*([\s\S]*?)\s*```/);
          if (match) parsed = JSON.parse(match[1]);
          else throw new Error(`Failed to parse AI refinement output: ${err.message}`);
        }

        const updatedComponents = Array.isArray(parsed) ? parsed : (parsed.components || components);
        return {
          success: true,
          refinementPrompt: prompt,
          components: updatedComponents,
          appliedPatches: [{ operation: 'ai-full-update', summary: `Gemma AI applied: "${prompt}"` }],
          aiActive: true,
          model: model || this.model,
          message: `Gemma AI applied your refinement: "${prompt}"`
        };
      } catch (aiError) {
        console.warn('AI refinement failed, using local engine:', aiError.message);
        // Fall through to local refinement engine
      }
    }

    // Local Deterministic Refinement Engine
    const lower = prompt.toLowerCase();
    const updated = JSON.parse(JSON.stringify(components));
    const patches = [];

    // 1. Spacing changes
    if (lower.includes('spacing') || lower.includes('spacious') || lower.includes('padding')) {
      const isSpacious = lower.includes('more') || lower.includes('increase') || lower.includes('spacious');
      const targetPadding = isSpacious ? '96px 24px' : '40px 16px';
      const targetNode = selectedId ? updated.find(c => c.id === selectedId) : updated.find(c => c.type === 'hero');
      if (targetNode) {
        targetNode.style = { ...targetNode.style, padding: targetPadding };
        patches.push({ operation: 'update-style', targetId: targetNode.id, style: { padding: targetPadding }, summary: `Updated padding to ${targetPadding} on ${targetNode.type}` });
      }
    }

    // 2. Navigation sticky toggle
    if (lower.includes('navigation') && lower.includes('sticky')) {
      const nav = updated.find(c => c.type === 'navbar');
      if (nav) {
        nav.props.isSticky = true;
        nav.style = { ...nav.style, position: 'sticky', top: 0, zIndex: 100 };
        patches.push({ operation: 'update-props', targetId: nav.id, props: { isSticky: true }, summary: 'Made navigation bar sticky at top of viewport' });
      }
    }

    // 3. CTA changes
    if (lower.includes('button') || lower.includes('call-to-action') || lower.includes('cta')) {
      const hero = updated.find(c => c.type === 'hero');
      if (hero && lower.includes('change')) {
        hero.props.primaryBtnText = 'Get Started Now';
        patches.push({ operation: 'update-props', targetId: hero.id, props: { primaryBtnText: 'Get Started Now' }, summary: 'Updated primary CTA button text' });
      }
    }

    // 4. Adding feature cards
    if (lower.includes('feature') && (lower.includes('add') || lower.includes('more'))) {
      const features = updated.find(c => c.type === 'features');
      if (features && Array.isArray(features.props.items)) {
        features.props.items.push({ icon: 'Layers', title: 'Cloud Orchestration', description: 'Automated container deployments with zero-downtime rolling updates.' });
        patches.push({ operation: 'update-props', targetId: features.id, props: { items: features.props.items }, summary: 'Added new feature card' });
      }
    }

    // 5. General heading/title changes
    if (lower.includes('heading') || lower.includes('title')) {
      const target = selectedId ? updated.find(c => c.id === selectedId) : updated.find(c => c.type === 'hero');
      if (target && target.props.title) {
        const cleaned = prompt.replace(/(change|update|make)\s+(the)?\s+(heading|title)\s+(to)?/i, '').replace(/[\"']/g, '').trim();
        if (cleaned) {
          target.props.title = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
          patches.push({ operation: 'update-props', targetId: target.id, props: { title: target.props.title }, summary: `Updated title to "${target.props.title}"` });
        }
      }
    }

    // 6. Dark/light mode toggle
    if (lower.includes('dark') || lower.includes('light')) {
      const hero = updated.find(c => c.type === 'hero') || updated[0];
      if (hero) {
        const isDark = lower.includes('dark');
        hero.style = { ...hero.style, backgroundColor: isDark ? 'var(--theme-background)' : '#ffffff', color: isDark ? '#f8fafc' : '#09090b' };
        patches.push({ operation: 'update-style', targetId: hero.id, style: hero.style, summary: `Applied ${isDark ? 'dark' : 'light'} mode styling` });
      }
    }

    // Fallback: generic content update
    if (patches.length === 0) {
      const target = selectedId ? updated.find(c => c.id === selectedId) : updated.find(c => c.type === 'hero');
      if (target) {
        target.props.subtitle = `Refined: "${prompt}". ${target.props.subtitle || ''}`.trim();
        patches.push({ operation: 'update-props', targetId: target.id, props: { subtitle: target.props.subtitle }, summary: `Applied refinement to ${target.type}` });
      }
    }

    return {
      success: true,
      refinementPrompt: prompt,
      components: updated,
      appliedPatches: patches,
      aiActive: false,
      message: `Applied ${patches.length} update(s) via local engine. For AI-powered refinements, add your API key in Settings.`
    };
  }


  /**
   * POST /api/diagnose - Diagnose reported issue with AST context
   * Uses AI when credentials are available, falls back to rule-based engine.
   */
  async diagnoseIssue({ issueDescription, components, selectedId = null, errorContext = '', model = null, apiKeyOverride = null }) {
    // Attempt AI-powered diagnosis
    if (this.isConfigured(apiKeyOverride)) {
      try {
        const systemInstruction = `You are MoodUI Studio's AI debugging assistant.
Analyze the given website component AST and the reported issue.
Return ONLY valid JSON with this exact shape:
{
  "severity": "low" | "medium" | "high",
  "componentId": string | null,
  "componentType": string,
  "suspectedCause": string,
  "explanation": string,
  "proposedRepair": {
    "operation": "update-style" | "update-props" | "remove" | "add",
    "targetId": string | null,
    "before": object,
    "after": object,
    "summary": string
  }
}`;

        const userPrompt = `Website Component AST:
${JSON.stringify(components, null, 2)}

Reported Issue: "${issueDescription}"
${errorContext ? `Error Context / Stack: "${errorContext}"` : ''}
${selectedId ? `User-Selected Component ID: "${selectedId}"` : ''}

Diagnose the root cause and provide a concrete repair patch.`;

        const rawJson = await this.callGoogleAI(userPrompt, systemInstruction, model, apiKeyOverride);
        let parsed;
        try {
          parsed = JSON.parse(rawJson);
        } catch (_) {
          const match = rawJson.match(/```json\s*([\s\S]*?)\s*```/);
          if (match) parsed = JSON.parse(match[1]);
          else throw new Error('AI diagnosis returned unparseable JSON');
        }

        return {
          success: true,
          issue: issueDescription,
          severity: parsed.severity || 'medium',
          componentId: parsed.componentId || null,
          componentType: parsed.componentType || 'component',
          suspectedCause: parsed.suspectedCause || 'AI analysis could not determine root cause',
          explanation: parsed.explanation || '',
          proposedRepair: parsed.proposedRepair || null,
          aiActive: true,
          model: model || this.model,
          timestamp: new Date().toISOString()
        };
      } catch (aiError) {
        console.warn('AI diagnosis failed, using rule-based engine:', aiError.message);
        // Fall through to local engine
      }
    }

    const lower = (issueDescription + ' ' + errorContext).toLowerCase();
    let diagnosedComponent = null;
    let cause = 'General layout or styling discrepancy';
    let explanation = '';
    let proposedFix = null;
    let severity = 'medium';

    if (lower.includes('overflow') || lower.includes('mobile') || lower.includes('horizontal')) {
      // Find component causing overflow
      diagnosedComponent = components.find(c => c.style?.width?.endsWith('px') && parseInt(c.style.width, 10) > 360) 
        || components.find(c => c.type === 'hero') 
        || components[0];
      
      severity = 'high';
      cause = 'Hardcoded pixel width or unconstrained container exceeding viewport width (360px).';
      explanation = `The component "${diagnosedComponent?.type || 'Container'}" has fixed dimensions that break mobile responsiveness, causing viewport horizontal scrolling.`;
      
      proposedFix = {
        operation: 'update-style',
        targetId: diagnosedComponent?.id,
        before: { width: diagnosedComponent?.style?.width || 'auto', maxWidth: 'none' },
        after: { width: '100%', maxWidth: '100%', boxSizing: 'border-box' },
        summary: 'Constrain width to 100% and add border-box sizing to eliminate mobile overflow.'
      };
    } else if (lower.includes('button') || lower.includes('click') || lower.includes('respond')) {
      diagnosedComponent = components.find(c => c.type === 'button') || components.find(c => c.type === 'hero') || components[0];
      cause = 'Missing button destination href or accessible click handler.';
      explanation = `The button or call-to-action in "${diagnosedComponent?.type}" lacks a valid target destination.`;
      
      proposedFix = {
        operation: 'update-props',
        targetId: diagnosedComponent?.id,
        before: { primaryBtnHref: diagnosedComponent?.props?.primaryBtnHref || '#' },
        after: { primaryBtnHref: '#contact', primaryBtnText: diagnosedComponent?.props?.primaryBtnText || 'Contact Us' },
        summary: 'Assign functional target link and accessible label to button.'
      };
    } else if (lower.includes('contrast') || lower.includes('color') || lower.includes('read')) {
      diagnosedComponent = selectedId ? components.find(c => c.id === selectedId) : components.find(c => c.type === 'hero') || components[0];
      cause = 'Low luminance contrast between foreground text and container background.';
      explanation = 'The color combination does not meet WCAG AA requirements of 4.5:1 contrast.';
      
      proposedFix = {
        operation: 'update-style',
        targetId: diagnosedComponent?.id,
        before: { color: diagnosedComponent?.style?.color || 'var(--text-color)' },
        after: { color: '#ffffff', backgroundColor: '#0f172a' },
        summary: 'Elevate text color luminance and contrast ratio.'
      };
    } else if (lower.includes('image') || lower.includes('alt') || lower.includes('broken')) {
      diagnosedComponent = components.find(c => c.type === 'hero' || c.type === 'image') || components[0];
      cause = 'Missing descriptive image alt attribute or unverified image link.';
      explanation = 'Screen readers cannot announce image content without descriptive alt text.';
      
      proposedFix = {
        operation: 'update-props',
        targetId: diagnosedComponent?.id,
        before: { imageAlt: diagnosedComponent?.props?.imageAlt || '' },
        after: { imageAlt: 'Modern web workspace preview illustrating responsive UI design' },
        summary: 'Provide descriptive WCAG compliant alt text for image.'
      };
    } else {
      diagnosedComponent = selectedId ? components.find(c => c.id === selectedId) : components[0];
      cause = 'Suboptimal spacing and alignment properties.';
      explanation = `Reported issue: "${issueDescription}". Analyzed component "${diagnosedComponent?.type || 'Root'}" hierarchy.`;
      
      proposedFix = {
        operation: 'update-style',
        targetId: diagnosedComponent?.id,
        before: { padding: diagnosedComponent?.style?.padding || '16px' },
        after: { padding: '48px 24px', margin: '0 auto' },
        summary: 'Normalize responsive padding and alignment.'
      };
    }

    return {
      success: true,
      issue: issueDescription,
      severity,
      componentId: diagnosedComponent?.id || null,
      componentType: diagnosedComponent?.type || 'component',
      suspectedCause: cause,
      explanation,
      proposedRepair: proposedFix,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * POST /api/repair - Apply or validate a proposed repair patch on AST
   */
  applyRepair({ components, repairPatch }) {
    const validation = validatePatch(repairPatch);
    if (!validation.valid) {
      throw new Error(`Invalid repair patch: ${validation.error}`);
    }

    const updated = JSON.parse(JSON.stringify(components));
    const target = updated.find(c => c.id === repairPatch.targetId);

    if (!target) {
      throw new Error(`Target component with id "${repairPatch.targetId}" not found in tree`);
    }

    if (repairPatch.operation === 'update-style') {
      target.style = { ...target.style, ...repairPatch.after };
    } else if (repairPatch.operation === 'update-props') {
      target.props = { ...target.props, ...repairPatch.after };
    }

    return {
      success: true,
      repairedComponentId: target.id,
      components: updated,
      message: `Successfully applied repair to ${target.type} (${target.id})`
    };
  }
}

export const gemmaService = new GemmaService();
