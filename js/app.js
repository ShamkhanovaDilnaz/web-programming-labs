// Учебные формы: проверка браузером, без отправки на сервер.
document.querySelectorAll('.contact-form').forEach(function (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    form.querySelector('.form-result').textContent = 'Данные корректны. Учебная форма: отправка на сервер не выполняется.';
  });
});

const registration = document.querySelector('#registration');
if (registration) {
  const steps = Array.from(registration.querySelectorAll('fieldset'));
  let currentStep = 0;

  function showStep(number) {
    currentStep = number;
    steps.forEach(function (step, index) {
      step.hidden = index !== number;
      step.disabled = index !== number;
    });
    document.querySelector('#step-status').textContent = 'Шаг ' + (number + 1) + ' из 3';
    steps[number].querySelector('input, select').focus();
  }

  function checkStep() {
    for (const field of steps[currentStep].querySelectorAll('input, select')) {
      if (!field.reportValidity()) return false;
    }
    return true;
  }

  registration.querySelectorAll('[data-next]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (checkStep()) showStep(currentStep + 1);
    });
  });
  registration.querySelectorAll('[data-back]').forEach(function (button) {
    button.addEventListener('click', function () { showStep(currentStep - 1); });
  });
  registration.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!checkStep()) return;
    if (currentStep < steps.length - 1) {
      showStep(currentStep + 1);
      return;
    }
    // Проверяем все шаги и включаем их поля для FormData.
    steps.forEach(function (step) { step.disabled = false; });
    const invalidStep = steps.findIndex(function (step) {
      return Array.from(step.querySelectorAll('input, select')).some(function (field) {
        return !field.checkValidity();
      });
    });
    if (invalidStep !== -1) {
      showStep(invalidStep);
      checkStep();
      return;
    }
    const data = new FormData(registration);
    registration.querySelector('.form-result').textContent = 'Данные проверены. Выбрано курсов: ' + data.getAll('courses').length + '. Отправка на сервер не выполняется.';
    steps.forEach(function (step, index) { step.disabled = index !== currentStep; });
  });
}
