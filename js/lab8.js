const form = document.querySelector('#validation-form');
const result = document.querySelector('#validation-result');
const fields = {
  email: document.querySelector('#check-email'),
  password: document.querySelector('#check-password'),
  phone: document.querySelector('#check-phone')
};

const rules = {
  email: /^[A-Za-z0-9]+(?:[._%+-][A-Za-z0-9]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/,
  password: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/,
  phone: /^\+[1-9]\d{7,14}$/
};

const errorTexts = {
  email: 'Введите адрес вида name@example.com.',
  password: 'Нужно не меньше 8 символов, заглавная буква, цифра и специальный знак.',
  phone: 'Введите номер с + и 8–15 цифрами, например +77001234567.'
};

form.addEventListener('submit', function (event) {
  event.preventDefault();
  result.textContent = '';

  form.querySelectorAll('.error-message').forEach(function (message) {
    message.remove();
  });
  Object.values(fields).forEach(function (field) {
    field.classList.remove('input-error');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  });

  const errors = { email: '', password: '', phone: '' };
  for (const name of Object.keys(fields)) {
    if (!rules[name].test(fields[name].value)) {
      errors[name] = errorTexts[name];
    }
  }

  for (const name of Object.keys(errors)) {
    if (!errors[name]) continue;
    const field = fields[name];
    const message = document.createElement('p');
    message.id = name + '-error';
    message.className = 'error-message';
    message.textContent = errors[name];
    field.insertAdjacentElement('afterend', message);
    field.classList.add('input-error');
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', message.id);
  }

  if (Object.values(errors).some(Boolean)) {
    result.textContent = 'Исправьте поля, выделенные красным.';
    form.querySelector('.input-error').focus();
  } else {
    result.textContent = 'Все данные введены правильно. Отправка на сервер не выполняется.';
  }
});
