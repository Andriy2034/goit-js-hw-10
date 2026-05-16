import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  dateInput: document.querySelector('#datetime-picker'),
  startButton: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startButton.disabled = true;

let userSelectedDate = null;
let countdownId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (!selectedDate || selectedDate <= new Date()) {
      userSelectedDate = null;
      refs.startButton.disabled = true;
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      return;
    }

    userSelectedDate = selectedDate;
    refs.startButton.disabled = false;
  },
};

const datePicker = flatpickr('#datetime-picker', options);

refs.startButton.addEventListener('click', () => {
  if (!userSelectedDate) {
    return;
  }

  refs.startButton.disabled = true;
  refs.dateInput.disabled = true;

  countdownId = setInterval(() => {
    const timeLeft = userSelectedDate - new Date();

    if (timeLeft <= 0) {
      clearInterval(countdownId);
      countdownId = null;
      refs.dateInput.disabled = false;
      datePicker.setDate(new Date(), true);
      userSelectedDate = null;
      updateTimer({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      return;
    }

    updateTimer(convertMs(timeLeft));
  }, 1000);

  updateTimer(convertMs(userSelectedDate - new Date()));
});

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return {
    days: addLeadingZero(days),
    hours: addLeadingZero(hours),
    minutes: addLeadingZero(minutes),
    seconds: addLeadingZero(seconds),
  };
}

function updateTimer({ days, hours, minutes, seconds }) {
  refs.days.textContent = days;
  refs.hours.textContent = hours;
  refs.minutes.textContent = minutes;
  refs.seconds.textContent = seconds;
}
