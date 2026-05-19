const form = document.getElementById('rsvpForm');
const attendingSelect = document.getElementById('attending');
const companionsGroup = document.getElementById('companionsGroup');
const guestSelect = document.getElementById('guestSelect');
const phoneGroup = document.getElementById('phoneGroup');
const telInput = document.getElementById('tel');
const attendingGroup = document.getElementById('attendingGroup');
const companionsSection = document.getElementById('companionsSection');
const companionsList = document.getElementById('companionsList');
const addCompanionButton = document.getElementById('addCompanionButton');
const message = document.getElementById('message');

function toggleMainPageCompanionField() {
  const attendingValue = attendingSelect.value;
  if (attendingValue === 'true') {
    companionsGroup.style.display = 'block';
  } else {
    companionsGroup.style.display = 'none';
  }
}

function togglePresencaFields() {
  const guestSelected = guestSelect && guestSelect.value;
  const phoneVisible = !!guestSelected;
  const hasPhone = telInput && telInput.value.trim().length > 0;
  const attendingVisible = phoneVisible;
  const attendingYes = attendingSelect && attendingSelect.value === 'true';

  if (phoneGroup) {
    phoneGroup.classList.toggle('hidden', !phoneVisible);
    if (telInput) telInput.required = phoneVisible;
  }

  if (attendingGroup) {
    attendingGroup.classList.toggle('hidden', !attendingVisible);
    if (attendingSelect) attendingSelect.required = attendingVisible;
  }

  if (companionsSection) {
    companionsSection.classList.toggle('hidden', !(phoneVisible && hasPhone && attendingYes));
  }
}

function createCompanionField(value = '') {
  if (!companionsList) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'companion-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'companion';
  input.className = 'companion-input';
  input.placeholder = 'Nome do acompanhante';
  input.value = value;

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'secondary-button companion-remove';
  removeBtn.textContent = 'Remover';
  removeBtn.addEventListener('click', () => wrapper.remove());

  wrapper.appendChild(input);
  wrapper.appendChild(removeBtn);
  companionsList.appendChild(wrapper);
}

async function loadGuestOptions() {
  if (!guestSelect) return;

  try {
    const response = await fetch('/api/guests');
    const result = await response.json();
    if (!result.success || !Array.isArray(result.guests)) {
      guestSelect.innerHTML = '<option value="">Não foi possível carregar convidados</option>';
      guestSelect.disabled = true;
      return;
    }

    if (result.guests.length === 0) {
      guestSelect.innerHTML = '<option value="">Nenhum convidado encontrado</option>';
      guestSelect.disabled = true;
      return;
    }

    guestSelect.innerHTML = '<option value="">Escolha seu nome</option>' +
      result.guests.map((guest) => `<option value="${guest.id}">${guest.name}</option>`).join('');
  } catch (error) {
    guestSelect.innerHTML = '<option value="">Erro ao carregar convidados</option>';
    guestSelect.disabled = true;
  }
}

if (attendingSelect && companionsGroup) {
  attendingSelect.addEventListener('change', toggleMainPageCompanionField);
}

if (guestSelect) {
  loadGuestOptions();
  guestSelect.addEventListener('change', togglePresencaFields);
}

if (telInput) {
  telInput.addEventListener('input', togglePresencaFields);
}

if (attendingSelect && guestSelect) {
  attendingSelect.addEventListener('change', togglePresencaFields);
}

if (addCompanionButton) {
  addCompanionButton.addEventListener('click', () => createCompanionField());
}

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    let body;

    if (guestSelect) {
      const guestId = formData.get('guestId');
      const attending = formData.get('attending') === 'true';
      const companions = Array.from(document.querySelectorAll('.companion-input'))
        .map((input) => input.value.trim())
        .filter((name) => name.length > 0);

      body = {
        guestId,
        tel: formData.get('tel'),
        attending,
        companions
      };
    } else {
      const attending = formData.get('attending') === 'true';
      const companionsText = formData.get('companions') || '';
      const companions = companionsText
        .split(',')
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      body = {
        name: formData.get('name'),
        email: formData.get('email'),
        attending,
        companions
      };
    }

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const result = await response.json();

      if (message) {
        message.style.display = 'block';
        if (result.success) {
          message.textContent = 'Confirmação enviada com sucesso!';
          form.reset();
          if (guestSelect) {
            togglePresencaFields();
            if (companionsList) companionsList.innerHTML = '';
          } else {
            toggleMainPageCompanionField();
          }
        } else {
          message.textContent = result.error || 'Erro ao enviar confirmação. Tente novamente.';
        }
      }
    } catch (error) {
      if (message) {
        message.style.display = 'block';
        message.textContent = 'Erro de rede. Verifique sua conexão.';
      }
    }
  });
}

const galleryImages = document.querySelectorAll('.info-photo-small img');
const imageModal = document.getElementById('imageModal');
const imageModalImg = document.getElementById('imageModalImg');
const imageModalClose = document.getElementById('imageModalClose');

function openImageModal(src, alt) {
  if (!imageModal || !imageModalImg) return;
  imageModalImg.src = src;
  imageModalImg.alt = alt;
  imageModal.classList.add('active');
  imageModal.setAttribute('aria-hidden', 'false');
}

function closeImageModal() {
  if (!imageModal || !imageModalImg) return;
  imageModal.classList.remove('active');
  imageModal.setAttribute('aria-hidden', 'true');
  imageModalImg.src = '';
}

galleryImages.forEach((image) => {
  image.addEventListener('click', () => {
    openImageModal(image.src, image.alt || 'Imagem ampliada');
  });
});

if (imageModalClose) {
  imageModalClose.addEventListener('click', closeImageModal);
}

if (imageModal) {
  imageModal.addEventListener('click', (event) => {
    if (event.target === imageModal) {
      closeImageModal();
    }
  });
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeImageModal();
  }
});
