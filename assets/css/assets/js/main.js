// ===== USER CONTENT (edit these safely) =====
const NAME_FULL = "Aakshat Hariharan";
const HANDLE = "aaks-hatH";
const GITHUB = "https://github.com/Aaks-hatH";

const HANDLER = {
  help: "Commands available:\n  help      Show this help text\n  about     Short bio\n  skills    Main skills & tech\n  projects  Projects / safe descriptions\n  contact   How to reach me\n  hobbies   What I enjoy\n  funfact   A quick funny line\n  clear     Clear the terminal output\n\nTip: Click the buttons below the terminal or just type and press Enter.\n(Autocomplete: press Tab.)",
  about: `${NAME_FULL} (aka ${HANDLE}) — cyber intelligence & OSINT practitioner. Focused on ethical research, threat analysis, and building defensive tooling. Learning more coding day by day (JS / Python / C / C#).`,
  skills: "Main skills:\n  • Cyber intelligence (threat research, OSINT)\n  • Defensive analysis & testing in lab environments\n  • Programming: JavaScript, Python, C, C#\n  • Tools: data collection, parsing, automation, reporting\n\nNote: I focus on ethical, authorized testing and learning.",
  projects: "Selected projects:\n\n  • sql-injection-scanner (research)\n    A safe, non-exploitative scanner prototype for testing SQL injection resilience in controlled labs. Used for research, training, and improving remediation workflows. No exploit code provided here.\n\n  • phishing-test\n    An internal phishing simulation framework for awareness training and measuring susceptibility within authorized environments. Designed to help teams learn and build better defenses.\n\n(If you'd like links or demo pages, I can add placeholders for GitHub / docs.)",
  contact: `Email: hariharanaakshat@gmail.com\nGitHub: ${GITHUB}\nHandle: ${HANDLE}\n\nDisclaimer: Please reach out with professional or collaboration inquiries only.`,
  hobbies: "Hobbies & interests:\n  • OSINT challenges and research\n  • Capture The Flag (CTF) style puzzles (ethical)\n  • Learning new languages and small coding projects\n  • I like music\n  • Coffee, tech podcasts, and tinkering with tools",
  funfact: "yes i am not hacking you right now\nNo, im not kidding."
};
// ===== end editable content =====

const typedEl = document.getElementById('typed');
const historyEl = document.getElementById('history');
const screen = document.getElementById('screen');
const cursor = document.getElementById('cursor');

const TYPING_SPEED = 24; // ms per char
const PAUSE_AFTER = 260;
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function appendHistoryLine(prompt, text){
  const wrapper = document.createElement('div');
  wrapper.innerHTML = '<span style="color:var(--muted)">'+escapeHtml(prompt)+'</span> <span style="color:var(--green)">'+escapeHtml(text)+'</span>';
  historyEl.appendChild(wrapper);
  screen.scrollTop = screen.scrollHeight;
}
function appendOutput(text){
  const o = document.createElement('div');
  o.className = 'out';
  o.textContent = text;
  historyEl.appendChild(o);
  screen.scrollTop = screen.scrollHeight;
}
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

async function runCommand(cmd){
  cmd = (cmd||'').trim();
  if(!cmd) return;
  appendHistoryLine('guest@site:~$', ' ' + cmd);
  typedEl.textContent = '';
  if(cmd === 'clear'){ historyEl.innerHTML = ''; return; }

  const output = HANDLER[cmd] ?? ("Command not found: " + cmd + "\nType 'help' for a list of commands.");
  if(prefersReduced){
    appendOutput(output);
    return;
  }
  await typeText(output);
}

function typeText(text){
  return new Promise((resolve) => {
    let i = 0;
    const container = document.createElement('div');
    container.className = 'out';
    historyEl.appendChild(container);
    screen.scrollTop = screen.scrollHeight;
    function step(){
      if(i < text.length){
        container.textContent += text[i++];
        screen.scrollTop = screen.scrollHeight;
        setTimeout(step, TYPING_SPEED);
      } else {
        setTimeout(resolve, PAUSE_AFTER);
      }
    }
    step();
  });
}

// Buttons
document.querySelectorAll('.btn').forEach(btn=>{
  btn.addEventListener('click', () => simulateType(btn.dataset.cmd));
});

// Keyboard input handling
let buffer = '';
document.addEventListener('keydown', (e)=>{
  if(e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey){
    buffer += e.key;
    typedEl.textContent = buffer;
    scrollToBottom(); return;
  }
  if(e.key === 'Backspace'){ buffer = buffer.slice(0,-1); typedEl.textContent = buffer; return; }
  if(e.key === 'Enter'){ const run = buffer; buffer = ''; typedEl.textContent = ''; runCommand(run); return; }
  if(e.key === 'Tab'){ e.preventDefault(); const keys = Object.keys(HANDLER); const match = keys.find(k => k.startsWith(buffer)); if(match){ buffer = match; typedEl.textContent = buffer; } return; }
});

function scrollToBottom(){ screen.scrollTop = screen.scrollHeight; }

function simulateType(cmd){
  if(prefersReduced){ runCommand(cmd); return; }
  const chars = cmd.split(''); let i = 0;
  typedEl.textContent = '';
  cursor.style.display = 'inline-block';
  const interval = setInterval(()=>{
    if(i < chars.length){ typedEl.textContent += chars[i++]; scrollToBottom(); } else { clearInterval(interval); setTimeout(()=> runCommand(cmd), 180); }
  }, TYPING_SPEED);
}

// focus for keyboard input
screen.focus();
