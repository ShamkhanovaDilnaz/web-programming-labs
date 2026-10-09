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

// Лабораторная 7: один обработчик для всех кнопок списка.
const todoForm = document.querySelector('#todo-form');
if (todoForm) {
  const input = document.querySelector('#task-input');
  const list = document.querySelector('#task-list');
  const count = document.querySelector('#task-count');
  const tasks = [];
  let nextId = 1;

  function updateCount() {
    count.textContent = 'Всего: ' + tasks.length + ', выполнено: ' + tasks.filter(function (task) {
      return task.done;
    }).length;
  }

  todoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      input.value = '';
      input.reportValidity();
      return;
    }

    const task = { id: nextId++, text: text, done: false };
    tasks.push(task);

    const item = document.createElement('li');
    item.dataset.id = String(task.id);
    const label = document.createElement('span');
    label.className = 'task-text';
    label.textContent = task.text;
    const doneButton = document.createElement('button');
    doneButton.type = 'button';
    doneButton.dataset.action = 'toggle';
    doneButton.textContent = 'Готово';
    doneButton.setAttribute('aria-pressed', 'false');
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.dataset.action = 'delete';
    deleteButton.textContent = 'Удалить';
    item.append(label, doneButton, deleteButton);
    list.appendChild(item);

    input.value = '';
    input.focus();
    updateCount();
  });

  list.addEventListener('click', function (event) {
    const button = event.target.closest('button');
    if (!button || !list.contains(button)) return;
    const item = button.closest('li');
    const id = Number(item.dataset.id);
    const index = tasks.findIndex(function (task) { return task.id === id; });
    if (index === -1) return;

    if (button.dataset.action === 'delete') {
      tasks.splice(index, 1);
      item.remove();
    } else if (button.dataset.action === 'toggle') {
      tasks[index].done = !tasks[index].done;
      item.classList.toggle('completed', tasks[index].done);
      button.textContent = tasks[index].done ? 'Вернуть' : 'Готово';
      button.setAttribute('aria-pressed', String(tasks[index].done));
    }
    updateCount();
  });
}
