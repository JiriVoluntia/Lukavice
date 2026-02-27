// Utility funkce pro správu modálních oken

class ModalManager {
  constructor() {
    this.currentModal = null;
    this.overlay = null;
  }

  createModal(title, subtitle = '') {
    // Zavření předchozího modálu
    if (this.currentModal) {
      this.closeModal();
    }
    
    // Vytvoření overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    
    // Vytvoření modálu
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Header
    const header = document.createElement('div');
    header.className = 'modal-header';
    
    const titleEl = document.createElement('h2');
    titleEl.className = 'modal-title';
    titleEl.textContent = title;
    header.appendChild(titleEl);
    
    if (subtitle) {
      const subtitleEl = document.createElement('p');
      subtitleEl.className = 'modal-subtitle';
      subtitleEl.textContent = subtitle;
      header.appendChild(subtitleEl);
    }
    
    modal.appendChild(header);
    
    // Content container
    const content = document.createElement('div');
    content.className = 'modal-content';
    content.id = 'modalContent';
    modal.appendChild(content);
    
    // Buttons container (bude v headeru)
    const buttons = document.createElement('div');
    buttons.className = 'modal-buttons';
    buttons.id = 'modalButtons';
    buttons.style.position = 'absolute';
    buttons.style.top = '24px';
    buttons.style.right = '24px';
    header.appendChild(buttons);
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    this.currentModal = {
      overlay: overlay,
      modal: modal,
      content: content,
      buttons: buttons
    };
    
    // Zavření při kliknutí na overlay
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeModal();
      }
    });
    
    return this.currentModal;
  }

  addField(label, type = 'text', placeholder = '', value = '') {
    const field = document.createElement('div');
    field.className = 'form-field';
    
    const labelEl = document.createElement('label');
    labelEl.className = 'form-field-label';
    labelEl.textContent = label;
    field.appendChild(labelEl);
    
    if (type === 'select') {
      const select = document.createElement('select');
      select.className = 'form-field-select';
      select.id = label.toLowerCase().replace(/\s+/g, '-');
      field.appendChild(select);
    } else if (type === 'date') {
      const dateField = document.createElement('div');
      dateField.className = 'form-field-date';
      const input = document.createElement('input');
      input.type = 'date';
      input.className = 'form-field-input';
      input.id = label.toLowerCase().replace(/\s+/g, '-');
      input.value = value;
      dateField.appendChild(input);
      field.appendChild(dateField);
    } else if (type === 'color') {
      const colorField = document.createElement('div');
      colorField.className = 'form-field-color';
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'form-field-input';
      input.id = label.toLowerCase().replace(/\s+/g, '-');
      input.placeholder = '#000000';
      input.value = value;
      input.maxLength = 7;
      
      const preview = document.createElement('div');
      preview.className = 'color-preview';
      if (value) {
        preview.style.backgroundColor = value;
      }
      
      input.addEventListener('input', (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
          preview.style.backgroundColor = e.target.value;
        }
      });
      
      colorField.appendChild(input);
      colorField.appendChild(preview);
      field.appendChild(colorField);
    } else {
      const input = document.createElement('input');
      input.type = type;
      input.className = 'form-field-input';
      input.id = label.toLowerCase().replace(/\s+/g, '-');
      input.placeholder = placeholder;
      input.value = value;
      field.appendChild(input);
    }
    
    this.currentModal.content.appendChild(field);
    return field;
  }

  addButton(text, onClick, type = 'save') {
    const button = document.createElement('button');
    button.className = `modal-btn modal-btn-${type}`;
    button.textContent = text;
    button.addEventListener('click', onClick);
    this.currentModal.buttons.appendChild(button);
    return button;
  }

  addRow(fullWidth = false) {
    const row = document.createElement('div');
    row.className = fullWidth ? 'modal-row full' : 'modal-row';
    this.currentModal.content.appendChild(row);
    return row;
  }

  addFieldToRow(row, label, type = 'text', placeholder = '', value = '') {
    const field = document.createElement('div');
    field.className = 'form-field';
    
    const labelEl = document.createElement('label');
    labelEl.className = 'form-field-label';
    labelEl.textContent = label;
    field.appendChild(labelEl);
    
    if (type === 'select') {
      const select = document.createElement('select');
      select.className = 'form-field-select';
      select.id = label.toLowerCase().replace(/\s+/g, '-');
      field.appendChild(select);
    } else if (type === 'date') {
      const dateField = document.createElement('div');
      dateField.className = 'form-field-date';
      const input = document.createElement('input');
      input.type = 'date';
      input.className = 'form-field-input';
      input.id = label.toLowerCase().replace(/\s+/g, '-');
      input.value = value;
      dateField.appendChild(input);
      field.appendChild(dateField);
    } else if (type === 'color') {
      const colorField = document.createElement('div');
      colorField.className = 'form-field-color';
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'form-field-input';
      input.id = label.toLowerCase().replace(/\s+/g, '-');
      input.placeholder = '#000000';
      input.value = value;
      input.maxLength = 7;
      
      const preview = document.createElement('div');
      preview.className = 'color-preview';
      if (value) {
        preview.style.backgroundColor = value;
      }
      
      input.addEventListener('input', (e) => {
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
          preview.style.backgroundColor = e.target.value;
        }
      });
      
      colorField.appendChild(input);
      colorField.appendChild(preview);
      field.appendChild(colorField);
    } else {
      const input = document.createElement('input');
      input.type = type;
      input.className = 'form-field-input';
      input.id = label.toLowerCase().replace(/\s+/g, '-');
      input.placeholder = placeholder;
      input.value = value;
      field.appendChild(input);
    }
    
    row.appendChild(field);
    return field;
  }

  closeModal() {
    if (this.currentModal) {
      this.currentModal.overlay.remove();
      this.currentModal = null;
    }
  }

  getFieldValue(fieldId) {
    const field = document.getElementById(fieldId);
    return field ? field.value : null;
  }

  setFieldValue(fieldId, value) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.value = value;
    }
  }
}

const modalManager = new ModalManager();
