document.fonts.ready.then(() => {
      document.body.classList.add("font-loaded");
    });
    function modalComponent() {
      return {
        show: false,
        content: '',
        open(html) {
          this.content = html;
          this.show = true;
        },
        close() {
          this.show = false;
          this.content = '';
        }
      }
    }