window.cookieConsentConfig = {
  timeout: 5000,
  location: false,
  content: {
    message: "This website uses cookies for best experience. By continuing you consent to our <a href=\"#\">Cookie Policy.</a>",
    dismiss: 'X',
  },
  elements: {
    dismiss: '<a title="dismiss cookie message" tabindex="0" style="display:block; cursor: pointer; font-size: 20px; background: none; width: auto; min-width: 0;" class="cc-btn cc-dismiss">X</a>',
  },
  showLink: false,
  palette: {
    popup: {
      background: "#dddddd",
      text: "#333333"
    },
    button: {
      background: "#dddddd",
      text: "#000000"
    }
  }  
}