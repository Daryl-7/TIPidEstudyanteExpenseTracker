import { useEffect, useRef, useState } from 'react'

export const moments = [
  { title: 'Login, savings tight', expression: 'Worried', message: 'Your phone fund is a bit tight this week. Trimming wants by about ₱100 would help.' },
  { title: 'Log a regular expense', expression: 'Happy', message: 'Logged! You have ₱620 left this week.' },
  { title: 'Log a big expense', expression: 'Shocked', message: "That's a big one, ₱500. Was it a need or a want? Tagging it helps you see the pattern." },
  { title: 'Spending too fast', expression: 'Shocked', message: "You've used 70% of your allowance and there are still 4 days left. Let's pace the rest: about ₱70 a day." },
  { title: 'Over budget', expression: 'Worried', message: "You're over by ₱120 this week. No stress, let's plan a lighter week ahead." },
  { title: 'Goal reached', expression: 'Celebrating', message: 'You did it! Phone fund is complete.' },
  { title: 'Streak milestone', expression: 'Celebrating', message: '7 days in a row of logging. Showing up is a habit worth keeping.' },
  { title: 'Welcome back', expression: 'Happy', message: "Welcome back! Want to log what you've spent?" },
  { title: 'Weekly review ready', expression: 'Happy', message: 'Your week in review is ready. Want to see where your money went?' },
  { title: 'Did you know?', expression: 'Neutral', message: 'Even ₱20 a day becomes ₱600 in a month.' },
]
export type PigMessage = typeof moments[number] & { id: number }

export default function FloatingAssistant({ current, onMessage }: { current: PigMessage; onMessage: (message: typeof moments[number]) => void }) {
  const [open, setOpen] = useState(true)
  const [demo, setDemo] = useState(false)
  const dock = useRef<HTMLDivElement>(null)
  const demoTrigger = useRef<HTMLButtonElement>(null)
  useEffect(() => { setOpen(true) }, [current.id])
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--assistant-space', `${(dock.current?.offsetHeight || 100) + 24}px`)
    })
    if (dock.current) observer.observe(dock.current)
    return () => { observer.disconnect(); document.documentElement.style.removeProperty('--assistant-space') }
  }, [])
  useEffect(() => {
    if (!demo) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setDemo(false); demoTrigger.current?.focus() } }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [demo])
  return <div className="assistant-dock" ref={dock}>
    <div className="assistant-tools">
      <button ref={demoTrigger} className="demo-trigger" aria-expanded={demo} aria-controls="demo-moments" onClick={() => setDemo(!demo)}>Demo moments</button>
      {demo && <section id="demo-moments" className="demo-panel" aria-label="Prototype demo moments">
        <div className="section-heading"><h2>Try a little moment</h2><button className="assistant-close" aria-label="Close demo moments" onClick={() => { setDemo(false); demoTrigger.current?.focus() }}>×</button></div>
        <p>Prototype only · no balances are changed</p>
        {moments.map(moment => <button key={moment.title} onClick={() => { onMessage(moment); setDemo(false); demoTrigger.current?.focus() }}><span>{moment.title}</span><small>{moment.expression}</small></button>)}
      </section>}
    </div>
    <div className="assistant-conversation">
      <section className={'assistant-bubble ' + (open ? 'is-open' : '')} aria-hidden={!open}>
        <button className="assistant-close" aria-label="Close mascot message" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>×</button>
        <span className="eyebrow">YOUR POCKET-SIZED CHEERLEADER</span>
        <p role="status" aria-live="polite">{open ? current.message : ''}</p>
      </section>
      <button className="floating-pig" aria-label={`${current.expression} piggy bank. Open latest message`} aria-expanded={open} onClick={() => setOpen(!open)}>
        <svg className="pig-art" width="52" height="45" viewBox="0 0 64 54" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M14 17 10 6l14 7M43 14 52 6v15M15 18C3 25 7 43 19 45l2 6h7l2-5h10l3 5h7l2-10 7-3V27l-7-2C47 11 26 10 15 18Z" fill="var(--pink-soft)"/>
          <path d="M27 17h12M10 28c-8-6-10 3-4 4" />
          <g className="pig-eyes"><path d="M23 27v3m17-3v3" /></g>
          <ellipse cx="32" cy="35" rx="8" ry="5"/><path d="M29 35h1m4 0h1"/>
          <circle cx="33" cy="6" r="5" fill="var(--gold-soft)" stroke="var(--gold)"/>
        </svg>
        <span>{current.expression}</span><small>ART PLACEHOLDER</small>
      </button>
    </div>
  </div>
}
