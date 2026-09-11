'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck, Landmark, Cpu, Bot, Zap, ArrowRight } from 'lucide-react';

interface FormattedAiMemoProps {
  content: string;
}

/**
 * Parses inline markdown bold: **text** -> <strong className="...">text</strong>
 */
function parseInlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong key={index} className="text-slate-100 font-semibold font-mono">
          {boldText}
        </strong>
      );
    }
    return part;
  });
}

export function FormattedAiMemo({ content }: FormattedAiMemoProps) {
  if (!content) return null;

  // Split content by double newlines or single newlines that precede a **HEADER**
  const rawSections = content.split(/\n\s*\n/);

  return (
    <div className="space-y-3 font-sans">
      {rawSections.map((section, idx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        // Check if section starts with **HEADER**: or **HEADER**
        const headerMatch = trimmed.match(/^\*\*([A-Z0-9\s—\-_]+)\*\*:\s*([\s\S]*)$/i);

        if (headerMatch) {
          const headerTitle = headerMatch[1].trim();
          const bodyText = headerMatch[2].trim();

          // Determine icon & color accent based on section name
          let accentColor = 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400';
          let IconComponent = Bot;

          if (headerTitle.includes('DECISION') || headerTitle.includes('EXECUTIVE') || headerTitle.includes('RATING')) {
            accentColor = 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400';
            IconComponent = CheckCircle2;
          } else if (headerTitle.includes('ATTESTATION') || headerTitle.includes('CRYPTOGRAPHIC') || headerTitle.includes('PROOF')) {
            accentColor = 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400';
            IconComponent = ShieldCheck;
          } else if (headerTitle.includes('VAULT') || headerTitle.includes('LIQUIDITY') || headerTitle.includes('ALLOCATION') || headerTitle.includes('CREDIT')) {
            accentColor = 'border-purple-500/30 bg-purple-950/20 text-purple-400';
            IconComponent = Landmark;
          }

          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-3.5 space-y-1.5 transition-colors hover:border-slate-700/80"
            >
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase border ${accentColor}`}>
                  <IconComponent className="h-3 w-3" />
                  <span>{headerTitle}</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans pl-0.5">
                {parseInlineMarkdown(bodyText)}
              </p>
            </div>
          );
        }

        // Standard bullet point or paragraph
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 pl-2">
              <span className="text-cyan-400 font-mono mt-0.5">•</span>
              <p className="leading-relaxed">{parseInlineMarkdown(trimmed.replace(/^[-*]\s+/, ''))}</p>
            </div>
          );
        }

        return (
          <p key={idx} className="text-xs text-slate-300 leading-relaxed">
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
