(() => {
  // app/javascript/trix-editor-overrides.js
  window.addEventListener("trix-file-accept", function(event) {
    const acceptedTypes = ["image/jpeg", "image/png"];
    const maxFileSize = 1024 * 1024 * 4;
    if (!acceptedTypes.includes(event.file.type)) {
      event.preventDefault();
      alert("Only support attachment of jpeg or png files");
    }
    if (event.file.size > maxFileSize) {
      event.preventDefault();
      alert("Only support attachment files upto size 4MB!");
    }
  });
})();
