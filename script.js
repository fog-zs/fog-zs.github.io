// Progressive enhancement: copy, titles and language links remain in static HTML.
(() => {
  const root = document.documentElement;
  const button = document.getElementById('themeToggle');
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem('theme'); } catch { /* Storage is optional. */ }
  let explicit = saved === 'dark' || saved === 'light';
  function apply(dark) {
    root.dataset.theme = dark ? 'dark' : 'light';
    button?.setAttribute('aria-pressed', String(dark));
  }
  apply(explicit ? saved === 'dark' : preference.matches);
  if (button) {
    button.hidden = false;
    button.addEventListener('click', () => {
      explicit = true;
      const dark = root.dataset.theme !== 'dark';
      apply(dark);
      try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch { /* Optional. */ }
    });
  }
  preference.addEventListener('change', event => { if (!explicit) apply(event.matches); });
})();

// Enhance project details only. Without dialog support or JavaScript, <details> works.
(() => {
  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
  const lang = document.documentElement.lang;
  const closeText = lang === 'ja' ? '閉じる' : lang.startsWith('zh') ? '关闭' : 'Close';
  for (const details of document.querySelectorAll('details[data-modal]')) {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.detail-content');
    const name = details.closest('.project').querySelector('h3').textContent;
    const dialog = document.createElement('dialog');
    dialog.id = details.dataset.modal;
    dialog.className = 'project-dialog';
    dialog.setAttribute('aria-labelledby', `${dialog.id}-title`);
    const header = document.createElement('div');
    header.className = 'dialog-header';
    const title = document.createElement('h2');
    title.id = `${dialog.id}-title`;
    title.textContent = `${name} — ${summary.textContent}`;
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'dialog-close';
    close.textContent = closeText;
    close.autofocus = true;
    header.append(title, close);
    dialog.append(header, content);
    const row = document.createElement('div');
    row.className = 'detail-trigger';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.textContent = summary.textContent;
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', dialog.id);
    row.append(trigger);
    details.replaceWith(row);
    document.body.append(dialog);
    const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let closing = false;
    const dismiss = () => {
      if (closing || !dialog.open) return;
      if (reducedMotion() || !dialog.animate) { dialog.close(); return; }
      closing = true;
      dialog.classList.add('is-closing');
      const animation = dialog.animate(
        [{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(6px) scale(.99)' }],
        { duration: 130, easing: 'cubic-bezier(.4, 0, 1, 1)', fill: 'forwards' }
      );
      const finish = () => {
        dialog.close();
        animation.cancel();
        dialog.classList.remove('is-closing');
        closing = false;
      };
      animation.finished.then(finish, finish);
    };
    trigger.addEventListener('click', () => {
      dialog.showModal();
      document.documentElement.classList.add('modal-open');
      close.focus();
      if (!reducedMotion() && dialog.animate) dialog.animate(
        [{ opacity: 0, transform: 'translateY(10px) scale(.98)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }],
        { duration: 180, easing: 'cubic-bezier(.16, 1, .3, 1)' }
      );
    });
    close.addEventListener('click', dismiss);
    dialog.addEventListener('cancel', event => { event.preventDefault(); dismiss(); });
    // Native dialog handles Escape and makes the rest of the page inert.
    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('modal-open');
      trigger.focus({ preventScroll: true });
    });
    const outside = event => {
      const r = dialog.getBoundingClientRect();
      return event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom);
    };
    let startedOutside = false;
    dialog.addEventListener('pointerdown', event => { startedOutside = outside(event); });
    dialog.addEventListener('click', event => {
      if (startedOutside && outside(event)) dismiss();
      startedOutside = false;
    });
  }
})();
