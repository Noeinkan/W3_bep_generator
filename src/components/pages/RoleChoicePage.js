import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSearch,
  FileText,
  ChevronRight,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { usePartyRole, PARTY_ROLE } from '../../contexts/PartyRoleContext';
import { cn } from '../../utils/cn';

/** ISO 19650 acronym glossary (tooltip + learn-more panel). */
const ACRONYM_GLOSSARY = [
  { abbr: 'EIR', title: 'Exchange Information Requirements' },
  { abbr: 'OIR', title: 'Organizational Information Requirements' },
  { abbr: 'PIR', title: 'Project Information Requirements' },
  { abbr: 'AIR', title: 'Asset Information Requirements' },
  { abbr: 'BEP', title: 'BIM Execution Plan' },
  { abbr: 'TIDP', title: 'Task Information Delivery Plan' },
  { abbr: 'MIDP', title: 'Master Information Delivery Plan' },
  { abbr: 'LOIN', title: 'Level of Information Need' },
];

const ROLES = [PARTY_ROLE.APPOINTING_PARTY, PARTY_ROLE.LEAD_APPOINTED_PARTY];

const ROLE_CONFIG = {
  [PARTY_ROLE.APPOINTING_PARTY]: {
    label: 'Appointing Party',
    sublabel: 'Client / Asset Owner',
    nextLabel: 'EIR Manager',
    nextPath: '/eir-manager',
    Icon: FileSearch,
    accent: 'amber',
    description: (
      <>
        I define information requirements (
        <Abbr title="Exchange Information Requirements">EIR</Abbr>, and in future{' '}
        <Abbr title="Organizational Information Requirements">OIR</Abbr>,{' '}
        <Abbr title="Project Information Requirements">PIR</Abbr>,{' '}
        <Abbr title="Asset Information Requirements">AIR</Abbr>) for the project.
      </>
    ),
  },
  [PARTY_ROLE.LEAD_APPOINTED_PARTY]: {
    label: 'Lead Appointed Party',
    sublabel: 'BIM Manager / Delivery',
    nextLabel: 'BEP Generator',
    nextPath: '/bep-generator',
    Icon: FileText,
    accent: 'primary',
    description: (
      <>
        I respond to the <Abbr title="Exchange Information Requirements">EIR</Abbr> with
        a <Abbr title="BIM Execution Plan">BEP</Abbr> and manage delivery (
        <Abbr title="Task Information Delivery Plan">TIDP</Abbr>,{' '}
        <Abbr title="Master Information Delivery Plan">MIDP</Abbr>, responsibility
        matrix, <Abbr title="Level of Information Need">LOIN</Abbr>).
      </>
    ),
  },
};

/**
 * ISO 19650 guided flow: choose Appointing Party or Lead Appointed Party.
 * UX: single-click selects, second click on same card navigates immediately.
 * Keyboard: Arrow keys switch cards, Enter confirms, focuses CTA.
 */
const RoleChoicePage = () => {
  const navigate = useNavigate();
  const { setPartyRole } = usePartyRole();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showGlossary, setShowGlossary] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const cardRefs = useRef([]);
  const ctaRef = useRef(null);

  const doNavigate = (role) => {
    if (isNavigating) return;
    setPartyRole(role);
    setIsNavigating(true);
    setTimeout(() => navigate(ROLE_CONFIG[role].nextPath, { replace: true }), 280);
  };

  const handleCardClick = (role) => {
    if (isNavigating) return;
    if (selectedRole === role) {
      // Second click on already-selected card → navigate immediately
      doNavigate(role);
    } else {
      setSelectedRole(role);
    }
  };

  const handleCardKeyDown = (e, role) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCardClick(role);
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (ROLES.indexOf(role) + 1) % ROLES.length;
      setSelectedRole(ROLES[next]);
      cardRefs.current[next]?.focus();
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (ROLES.indexOf(role) - 1 + ROLES.length) % ROLES.length;
      setSelectedRole(ROLES[prev]);
      cardRefs.current[prev]?.focus();
    }
  };

  const handleContinue = () => {
    if (!selectedRole) return;
    doNavigate(selectedRole);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 130% 80% at 50% -10%, rgba(37, 99, 235, 0.07), transparent 65%),
          radial-gradient(ellipse 70% 50% at 85% 55%, rgba(245, 158, 11, 0.05), transparent 60%),
          var(--ui-canvas)
        `,
      }}
      data-page-uri="/role-choice"
    >
      {/* Dot-grid decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--ui-border) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.45,
        }}
        aria-hidden
      />

      <div className="w-full max-w-3xl relative z-10">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="text-center mb-10">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-ui-surface border border-ui-border text-ui-text-muted shadow-sm mb-5 tracking-widest uppercase"
            aria-hidden
          >
            <span className="w-1.5 h-1.5 rounded-full bg-ui-primary/70 animate-pulse-subtle" />
            ISO 19650
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ui-text tracking-tight mb-3">
            Who are you in this project?
          </h1>
          <p className="text-ui-text-muted text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Select your role to unlock the right tools for your workflow.
          </p>
        </header>

        {/* ── Role cards ──────────────────────────────────────────── */}
        <div
          className="grid gap-4 sm:gap-5 sm:grid-cols-2 mb-8"
          role="radiogroup"
          aria-label="Role selection"
        >
          {ROLES.map((role, index) => {
            const config = ROLE_CONFIG[role];
            const Icon = config.Icon;
            const isSelected = selectedRole === role;
            const isAmber = config.accent === 'amber';

            return (
              <button
                key={role}
                ref={(el) => (cardRefs.current[index] = el)}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isNavigating}
                onClick={() => handleCardClick(role)}
                onKeyDown={(e) => handleCardKeyDown(e, role)}
                style={{ animationDelay: index === 1 ? '100ms' : '0ms' }}
                className={cn(
                  'group relative flex flex-col items-start text-left p-6 sm:p-8 rounded-2xl border-2 transition-all duration-300 ease-out animate-fade-up',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ui-canvas)]',
                  isSelected && isAmber &&
                    'border-amber-500 bg-gradient-to-br from-amber-50/90 to-amber-50/30 shadow-xl ring-4 ring-amber-400/20 -translate-y-1.5',
                  isSelected && !isAmber &&
                    'border-ui-primary bg-gradient-to-br from-blue-50/90 to-blue-50/30 shadow-xl ring-4 ring-ui-primary/20 -translate-y-1.5',
                  !isSelected &&
                    'border-ui-border bg-ui-surface shadow-card hover:shadow-lg hover:-translate-y-0.5',
                  !isSelected && isAmber && 'hover:border-amber-400/60',
                  !isSelected && !isAmber && 'hover:border-ui-primary/50',
                  isNavigating && 'pointer-events-none',
                )}
              >
                {/* Selected badge */}
                {isSelected && (
                  <span
                    className={cn(
                      'absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold animate-scale-in',
                      isAmber ? 'text-amber-600' : 'text-ui-primary',
                    )}
                    aria-hidden
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    {isNavigating ? 'Opening…' : 'Selected'}
                  </span>
                )}

                {/* Icon */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300',
                    isAmber
                      ? isSelected
                        ? 'bg-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-110'
                        : 'bg-amber-100 group-hover:bg-amber-150 group-hover:scale-105'
                      : isSelected
                      ? 'bg-blue-200 shadow-[0_0_20px_rgba(37,99,235,0.3)] scale-110'
                      : 'bg-ui-primary/10 group-hover:bg-ui-primary/15 group-hover:scale-105',
                  )}
                >
                  <Icon
                    className={cn(
                      'w-7 h-7 transition-transform duration-300',
                      isSelected && 'scale-110',
                      isAmber ? 'text-amber-700' : 'text-ui-primary',
                    )}
                    aria-hidden
                  />
                </div>

                {/* Title + sublabel */}
                <div className="mb-2 pr-20">
                  <h2 className="text-xl font-semibold text-ui-text leading-tight">
                    {config.label}
                  </h2>
                  <p
                    className={cn(
                      'text-xs font-medium mt-0.5 transition-colors duration-200',
                      isSelected
                        ? isAmber
                          ? 'text-amber-600'
                          : 'text-ui-primary'
                        : 'text-ui-text-muted',
                    )}
                  >
                    {config.sublabel}
                  </p>
                </div>

                <p className="text-sm text-ui-text-muted leading-relaxed mb-5 flex-1">
                  {config.description}
                </p>

                {/* Footer hint */}
                <div className="flex items-center justify-between w-full gap-2">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-200',
                      isSelected
                        ? isAmber
                          ? 'text-amber-700 font-semibold'
                          : 'text-ui-primary font-semibold'
                        : 'text-ui-text-muted group-hover:text-ui-text-soft',
                    )}
                  >
                    <ArrowRight
                      className={cn(
                        'w-3.5 h-3.5 transition-transform duration-200 shrink-0',
                        isSelected
                          ? 'translate-x-0.5'
                          : 'group-hover:translate-x-0.5',
                      )}
                      aria-hidden
                    />
                    {isSelected ? `Go to ${config.nextLabel}` : `Opens ${config.nextLabel}`}
                  </span>

                  {isSelected && !isNavigating && (
                    <span className="text-[10px] text-ui-text-muted animate-fade-in whitespace-nowrap">
                      Click again to open
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── CTA + glossary toggle ────────────────────────────────── */}
        <div className="flex flex-col items-center gap-4">
          <button
            ref={ctaRef}
            type="button"
            onClick={handleContinue}
            disabled={!selectedRole || isNavigating}
            className={cn(
              'inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 min-w-[260px]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ui-canvas)]',
              selectedRole && !isNavigating
                ? 'bg-ui-primary text-white hover:bg-ui-primary-hover shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                : selectedRole && isNavigating
                ? 'bg-ui-primary text-white shadow-lg opacity-80 cursor-wait'
                : 'bg-ui-muted text-ui-text-muted cursor-not-allowed',
            )}
          >
            {isNavigating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden />
                Opening…
              </>
            ) : selectedRole ? (
              <>
                Continue to {ROLE_CONFIG[selectedRole].nextLabel}
                <ChevronRight className="w-5 h-5 shrink-0" aria-hidden />
              </>
            ) : (
              'Select a role to continue'
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowGlossary((v) => !v)}
            className="inline-flex items-center gap-2 text-sm text-ui-text-muted hover:text-ui-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ui-canvas)] rounded-lg py-1.5 px-2"
            aria-expanded={showGlossary}
          >
            <HelpCircle className="w-4 h-4 shrink-0" aria-hidden />
            {showGlossary ? 'Hide' : 'ISO 19650 acronym glossary'}
          </button>
        </div>

        {/* ── Glossary (animated) ──────────────────────────────────── */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            showGlossary ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0',
          )}
          aria-hidden={!showGlossary}
        >
          <section
            className="p-5 sm:p-6 rounded-2xl border border-ui-border bg-ui-surface text-sm text-ui-text-muted"
            aria-label="Acronym glossary"
          >
            <p className="font-semibold text-ui-text mb-3">ISO 19650 acronyms</p>
            <dl className="grid gap-2 sm:grid-cols-2">
              {ACRONYM_GLOSSARY.map(({ abbr, title }) => (
                <div
                  key={abbr}
                  className="flex gap-2 py-1 border-b border-ui-border last:border-0 sm:odd:border-r sm:odd:pr-4 sm:odd:border-b-0 sm:even:border-b-0"
                >
                  <dt className="font-semibold text-ui-text shrink-0 w-12">{abbr}</dt>
                  <dd className="min-w-0">{title}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
};

/** Inline abbreviation with native tooltip. */
function Abbr({ title, children }) {
  return (
    <abbr
      title={title}
      className="cursor-help border-b border-dotted border-ui-text-muted/70 hover:border-ui-text-muted"
    >
      {children}
    </abbr>
  );
}

export default RoleChoicePage;
