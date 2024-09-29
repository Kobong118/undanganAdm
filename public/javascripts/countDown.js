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

// fron end hendling submit donatur
    document.getElementById('donaturForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const namaDonatur = document.getElementById('namaDonatur').value;

        // Validasi nama
        if (!namaDonatur || namaDonatur.length > 20) {
            alert('Nama tidak boleh kosong atau melebihi 20 karakter.');
            return;
        }

        // Geolocation API untuk mendapatkan koordinat pengguna
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Kirim nama dan lokasi ke server
                const response = await fetch('/hadiah', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        namaDonatur,
                        location: {
                            latitude: latitude,
                            longitude: longitude
                        }
                    })
                });

                const result = await response.json();
                if (result.success) {
                    alert(result.message);
                    loadDonatur();
                    alert('Anda akan di arahkan ke nomor Whatsapp Khodim majlis, pastikan anda telah menyematkan bukti transfer berupa screenshot atau foto di kolom chat whastapp anda');
                    window.open(`https://wa.me/send?phone=6282315172068&text=Saya%20telah%20mengirim%20hadiah%20atas%20nama%20Undangan:%0A${namaDonatur}`)
                } else {
                    alert(result.message);
                }
            }, function (error) {
                alert('Gagal mendapatkan lokasi.');
            });
        } else {
            alert('Geolocation tidak didukung oleh browser Anda.');
        }
    });
  
    // fron end hendling submit pesan
    document.getElementById('messageForm').addEventListener('submit', async function (e) {
      e.preventDefault();

      const namaPengirim = document.getElementById('namaPengirim').value;
      const pesan = document.getElementById('messagePengirim').value

      // Validasi submit
      if(!namaPengirim || namaPengirim.length > 20){
        alert('Nama tidak boleh kosong atau lebih dari 20 karakter');
          return;
        }
    if (!pesan || pesan.length > 200) {
      alert('Pesan tidak boleh kosong atau lebih dari 200 karakter');
      return;
        }

      // Geolocation API untuk mendapatkan koordinat pengguna
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async function (position) {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;

              // Kirim nama dan lokasi ke server
              const response = await fetch('/pesan', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      namaPengirim,
                      pesan,
                      location: {
                          latitude: latitude,
                          longitude: longitude
                      }
                  })
              });

              const result = await response.json();
              if (result.success) {
                  alert(result.message);
                  pesan.value="";
                  loadPesan();
              } else {
                  alert(result.message);
              }
          }, function (error) {
              alert('Gagal mendapatkan lokasi.');
          });
      } else {
          alert('Geolocation tidak didukung oleh browser Anda.');
      }
  });
  // function load donatur
  async function loadDonatur() {
    try{
      const response = await fetch('/hadiah',{method: 'GET'});
      const dataDonatur = await response.json();
      const donaturContainer = document.getElementById('donatur');
      donaturContainer.innerHTML = '';
      if (dataDonatur.donatur){
        const h6 = document.createElement('h6');
        h6.classList.add('text-sm','font-light','mb-1');
        h6.innerHTML = `Terimakasih<strong class="text-turqu"> Kepada:</strong>`;
        donaturContainer.appendChild(h6);

        dataDonatur.donatur.forEach(donat =>{
          if(donat.show){
        const donaturElement = document.createElement('div');
        donaturElement.classList.add('flex','flex-col','items-start','p-1','border','border-turqu-prime','rounded-xl');
        donaturElement.innerHTML = `
        <div class="w-full flex justify-between items-center">
                                        <div class="">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor"
                                                class="bi bi-person-circle fill-turqu-prime inline-block"
                                                viewBox="0 0 16 16">
                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                                <path fill-rule="evenodd"
                                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                            </svg><span> ${donat.nama}</span>
                                        </div>
                                        <div class=" text-xs">
                                            <span>${timeAgo(donat.date)}</span>
                                        </div>
                                    </div>
                                    <div class="w-full text-xs">
                                        <img src="/images/${donat.verifikasi ? 'person-check.svg':'person-ex.svg'}" alt="Terkomfirmasi" class="inline-block" />
                                        <span>${donat.verifikasi ? 'Terkonfirmasi':'masuk antrian konfirmasi...'}</span>
                                    </div>
        `;
        donaturContainer.appendChild(donaturElement);
          }
        });
      }
    }catch (error){
      console.error('Error:', error);
    }
  }
  loadDonatur();

  // function load pesan
  async function loadPesan() {
    try{
      const response = await fetch('/pesan',{method: 'GET'});
      const data = await response.json();
      const pesanContainer = document.getElementById('pesan');
      pesanContainer.innerHTML = '';
      if (data.messages){
        const h6 = document.createElement('h6');
        h6.classList.add('text-sm','font-light','mb-1');
        h6.innerHTML = `Pesan<strong class="text-turqu"> Masuk:</strong>`;
        pesanContainer.appendChild(h6);

        data.messages.forEach(pesan =>{
          if(pesan.show){
        const pesanElement = document.createElement('div');
        pesanElement.classList.add('flex','flex-col','items-start','border','border-turqu-prime','rounded-xl','mx-4','mb-4');
        pesanElement.innerHTML = `<div class="container flex justify-around p-1 items-center">
                                    <div class="w-1/2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="currentColor"
                                            class="bi bi-person-circle fill-turqu-prime inline-block"
                                            viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                            <path fill-rule="evenodd"
                                                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                        </svg><span> ${pesan.nama}</span>
                                    </div>
                                    <div class="w-1/2 text-xs">
                                        <span>${timeAgo(pesan.date)}</span>
                                    </div>
                                </div>
                                <div class="w-full text-left m-1 shadow shadow-turqu rounded-xl p-1 bg-white bg-opacity-40">
                                    <p>${pesan.pesan}</p>
                                </div>`;
        pesanContainer.appendChild(pesanElement);
          }
        });
      }
    }catch (error){
      console.error('Error:', error);
    }
  }
  loadPesan();

  // funtion time ego
  function timeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const secondsAgo = Math.floor((now - time) / 1000);

    const intervals = {
        tahun: 365 * 24 * 60 * 60,
        bulan: 30 * 24 * 60 * 60,
        minggu: 7 * 24 * 60 * 60,
        hari: 24 * 60 * 60,
        jam: 60 * 60,
        menit: 60,
        detik: 1
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(secondsAgo / secondsInUnit);
        if (interval >= 1) {
            return interval === 1 ? `1 ${unit} yang lalu` : `${interval} ${unit} yang lalu`;
        }
    }

    return "Baru saja";
}

