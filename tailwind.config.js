/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',  // Prefix Tailwind class with 'tw-'
  content: ['./views/**/*.ejs', './public/**/*.js','./src/**/*.js'],
  theme: {
    fontFamily: {
      kufi: ["kufi", "sans-serif"],
      zilla:["Zilla Slab", "system-ui"],
      amiri:["Amiri Quran","serif"],
      sofia:["Sofia", "system-ui"],
      Rundkursiv:["Rundkursiv","system-ui"]
    },
    extend: {
      backgroundImage: {
        'bg-m': "url('/images/Background.gif')",
        'bg-platen':"url('/images/platen.gif')",
        'aw' :"url('/images/bg-0.gif')",
        'start':"url('/images/start.png')",
        'bg-1':"url('/images/bg-1.gif')",
        'd-bl':"url('/images/d-bl.png')",
        'd-br':"url('/images/d-br.png')",
        'd-tr':"url('/images/d-tr.png')",
        'd-tl':"url('/images/d-tl.png')",
        'd-c':"url('/images/d-c.png')",
        'd-cr':"url('/images/d-cr.png')",
        'd-cl':"url('/images/d-cl.png')",
        'panitia':"url('/images/panitia.png')",
        'd-d':"url('/images/d-d.png')",
        'd-l1':"url('/images/d-l1.png')",
        'd-l2':"url('/images/d-l2.png')",
        'slide1':"url('/images/abuyaSimpang.gif')",
        'slide2':"url('/images/buyaBurdah.gif')",
        'slide3':"url('/images/akangHj.gif')",
        'slide4':"url('/images/denMatin.gif')",
        'slide5':"url('/images/ikhwani.gif')",
        'slide-all':"url('/images/all.gif')",
        'sdq':"url('/images/atm.gif')",
        'atm':"url('/images/atm.png')",
        'pesan':"url('/images/pesan.gif')",
      },
      backgroundSize: {
        '20%':'20%',
        '50%':'50%',
        '108%':'108%',
        '100%' : '100%',
        '100-100' : '50% 100%',
        '150%':'150%',
        'hv':'auto 100%',
        'vw':'100vw',
        '200':'200%'
      },
      colors: {
        'turqu':"#2a7060",
        'turqu-prime':'#3baca3',
        'text1':'#f4d390'
      },
      animationDelay: {
        '1s': '1s',
        '2s': '2s',
        '3s': '3s',
        // tambahkan lebih banyak delay jika diperlukan
      },
      animationIterationCount:{
        '3':'3'
      },
      animation: {
        zoo: 'zoo 3s',
        zoo2: 'zoo2 3s',
        logo: 'logo 3s',
        zhv:'zhv 3s',
        zhv2:'zhv2 3s',
        masjid :'masjid 1s linear',
        'masjid-lg':'masjid-lg 1s linear',
        'masjid-b' :'masjid-b 1s linear',
        'masjid-lg-b':'masjid-lg-b 1s linear',
        'bintang-show' : 'bintang-show 3s ease-in-out',
        'bintang-hidd' : 'bintang-hidd 3s ease-in-out',
        'spin-slow': 'spin 6s linear infinite',
        'scaleTransRot-l':' scalaTransRotL 3s linear',
        'scaleTransRot-r':' scalaTransRotR 3s linear',
        'slide-in':'slide-in 3s ease-in-out',
        'slide-out':'slide-out 5s ease-in-out',
      },
      keyframes: {
        zoo: {
          '0%': { 'background-size': '150%'},
          '100%': { 'background-size': '100%' },
        },
        zoo2: {
          '0%': { 'background-size': '150%'},
          '100%': { 'background-size': '100%' },
        },
        zhv: {
          '0%': { 'background-size': 'auto 150%'},
          '100%': { 'background-size': ' auto 100%' },
        },
        zhv2: {
          '0%': { 'background-size': 'auto 150%'},
          '100%': { 'background-size': ' auto 108%' },
        },
        logo: {
          '0%, 35%':{opacity : '0'},
          '100%':{opacity:'1'}
        },
        masjid:{
          '0%':{transform: 'scaleY(0)',opacity :'0',transform: 'translateY(12rem)'},
          '100%':{transform: 'scaleY(1)',opacity:'1',transform: 'translateY(0rem)'}
        },
        'masjid-lg':{
          '0%':{transform: 'scaleY(0)',opacity :'0',transform: 'translateY(16rem)'},
          '100%':{transform: 'scaleY(1)',opacity:'1',transform: 'translateY(0rem)'}
        },
        'masjid-b':{
          '100%':{transform: 'scaleY(1)',opacity :'1',transform: 'translateY(0rem)'},
          '0%':{transform: 'scaleY(0)',opacity:'0',transform: 'translateY(12rem)'}
        },
        'masjid-lg-b':{
          '100%':{transform: 'scaleY(1)',opacity :'1',transform: 'translateY(0rem)'},
          '0%':{transform: 'scaleY(0)',opacity:'0',transform: 'translateY(16rem)'}
        },
        'bintang-show':{
            '0%':{transform:'translateY(-2rem)',opacity:'0'},
          '100%':{transform:'translateY(0rem)',opacity:'1'}
        },
        'bintang-hidd':{
            '0%':{transform:'translateY(2rem)',opacity:'0'},
          '100%':{transform:'translateY(0rem)',opacity:'1'}
        },
        scalaTransRotL:{
          '0%':{transform:'scale(3.5) translateX(0%) rotate(360deg)'},
          '100%':{transform:'scale(1) translateX(-50%) rotate(0deg)'}
        },
        scalaTransRotR:{
          '0%':{transform:'scale(3.5) translateX(0%) rotate(-360deg)'},
          '100%':{transform:'scale(1) translateX(50%) rotate(0deg)'}
        },
        'slide-in': {
          '0%': { opacity: 0, transform: 'translateY(100%)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-out': {
          '0%,50%': { height:'24rem',opacity:1 },
          '100%': { height:'0px',opacity:0  },
        },
      },
      translate:{
        'm-50%':'-50%',
        'm-45%':'-45%',
        'm-40%':'-40%',
        '50%':'50%'
      },
      gridTemplateColumns:{
        'stack':'repeat(12,1fr)'
      },
      gridRow:{
        'satu':'1',
        'dua':'2'
      },
      gridColumn:{
        'pat':'4',
        'del':'8',
        'sem':'9'
      },
      height:{
        'h-screen-90':'90vh',
        'h-screen-80':'80vh'
      },
      space:{
        '30rem':'30rem'
      },
      scrollbar: {
        none: {
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none', /* Firefox */
          '&::-webkit-scrollbar': {
            display: 'none', /* Chrome, Safari, and Edge */
          },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme, e }) {
      const utilities = Object.entries(theme('animationDelay')).map(([key, value]) => {
        return {
          [`.${e(`delay-${key}`)}`]: { animationDelay: value },
        };
      });
      addUtilities(utilities);
    },
    function ({ addUtilities, theme, e }) {
      const utilities = Object.entries(theme('animationIterationCount')).map(([key, value]) => {
        return {
          [`.${e(`count-${key}`)}`]: { animationIterationCount: value },
        };
      });
      addUtilities(utilities);
    },
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-none': {
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none', /* Firefox */
          '&::-webkit-scrollbar': {
            display: 'none', /* Chrome, Safari, and Edge */
          },
        },
      });
    },
  ],
}
