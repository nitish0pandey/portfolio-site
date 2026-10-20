const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.dataset.open = String(!isOpen);
    menuButton.querySelector('.sr-only').textContent = isOpen ? 'Open navigation' : 'Close navigation';
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.dataset.open = 'false';
      menuButton.querySelector('.sr-only').textContent = 'Open navigation';
    });
  });
}

// WhatsApp number in international format, without a plus sign or spaces.
const WHATSAPP_NUMBER = '919002012401';

const talkTrigger = document.querySelector('.talk-trigger');
const talkDialog = document.querySelector('#lets-talk-dialog');
const talkForm = document.querySelector('#lets-talk-form');
const dialogFocus = new WeakMap();

const setFormStatus = (statusElement, message, state) => {
  statusElement.textContent = message;
  statusElement.dataset.state = state;
  statusElement.hidden = false;
};

const clearFormStatus = (statusElement) => {
  statusElement.textContent = '';
  statusElement.hidden = true;
  delete statusElement.dataset.state;
};

const setupDialog = (trigger, dialog, closeButton) => {
  if (!trigger || !dialog || !closeButton) return;

  trigger.addEventListener('click', () => {
    dialogFocus.set(dialog, document.activeElement);
    dialog.showModal();
    closeButton.focus();
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => dialogFocus.get(dialog)?.focus());
};

setupDialog(talkTrigger, talkDialog, document.querySelector('.talk-close'));

const siteFooter = document.querySelector('.site-footer');
if (talkTrigger && siteFooter && 'IntersectionObserver' in window) {
  const footerObserver = new IntersectionObserver(([entry]) => {
    talkTrigger.classList.toggle('is-near-footer', entry.isIntersecting);
  }, { threshold: 0.05 });

  footerObserver.observe(siteFooter);
}

if (talkForm) {
  const nameInput = document.querySelector('#talk-name');
  const emailInput = document.querySelector('#talk-email');
  const messageInput = document.querySelector('#talk-message');
  const status = document.querySelector('#talk-status');

  talkForm.addEventListener('input', () => clearFormStatus(status));
  talkForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = messageInput.value.trim();

    if (!message) {
      setFormStatus(status, 'Please enter a message before continuing.', 'error');
      messageInput.focus();
      return;
    }

    if (emailInput.value.trim() && !emailInput.validity.valid) {
      setFormStatus(status, 'Please enter a valid email address or leave it blank.', 'error');
      emailInput.focus();
      return;
    }

    if (WHATSAPP_NUMBER.includes('YOURNUMBER')) {
      setFormStatus(status, 'WhatsApp is not configured yet. Replace WHATSAPP_NUMBER in script.js with your number.', 'warning');
      return;
    }

    const reason = talkForm.querySelector('input[name="topic"]:checked')?.value || 'Other';
    const name = nameInput.value.trim() || 'Not provided';
    const email = emailInput.value.trim() || 'Not provided';
    const whatsappMessage = `Hi Nitish, I’m reaching out through your portfolio.\n\nReason: ${reason}\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
}
