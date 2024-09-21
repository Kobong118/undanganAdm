document.addEventListener('DOMContentLoaded', function () {
    const countdown = {
      daysEl: document.querySelector('.bloc-time.days .figure'),
      hoursEl: document.querySelector('.bloc-time.hours .figure'),
      minutesEl: document.querySelector('.bloc-time.minutes .figure'),
      secondsEl: document.querySelector('.bloc-time.seconds .figure'),
      targetDate: new Date('2024-10-27T05:59:59'), // Set target date
  
      init: function () {
        this.updateCountdown();
        setInterval(this.updateCountdown.bind(this), 1000);
      },
  
      updateCountdown: function () {
        const now = new Date();
        const timeLeft = Math.floor((this.targetDate - now) / 1000);
  
        if (timeLeft >= 0) {
          const days = Math.floor(timeLeft / (60 * 60 * 24));
          const hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));
          const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
          const seconds = Math.floor(timeLeft % 60);
  
          this.updateFigure(this.daysEl, days);
          this.updateFigure(this.hoursEl, hours);
          this.updateFigure(this.minutesEl, minutes);
          this.updateFigure(this.secondsEl, seconds);
        }
      },
  
      updateFigure: function (el, value) {
        const topSpan = el.querySelector('.top');
        const bottomSpan = el.querySelector('.bottom');
  
        const currentValue = topSpan.textContent;
        if (currentValue !== value.toString()) {
          topSpan.textContent = value;
          bottomSpan.textContent = value;
  
          // Trigger flip animation
          el.classList.add('flipping');
          setTimeout(() => {
            el.classList.remove('flipping');
          }, 500); // Duration of flip animation
        }
      },
    };
  
    countdown.init();
  });

  // Dalam file JavaScript Anda (atau menggunakan Alpine.js secara inline)
document.addEventListener('alpine:init', () => {
  Alpine.data('slideShow', (slideIndex) => ({
    slideIndex: 0,
    slides: [1, 2, 3, 4, 5],
    init() {
      setInterval(() => {
        this.slideIndex = (this.slideIndex + 1) % this.slides.length;
      }, 3000);
    },
  }));
});
  