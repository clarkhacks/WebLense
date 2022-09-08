// Weblense.co javascript api. v1.0.0
const webLense = {
    load: function () {
      const liveImages = document.querySelectorAll("[weblense-src]");
      liveImages.forEach((liveImage) => {
        let imageLatest = false;
        const imageSize = liveImage.getAttribute("weblense-src").split(",")[0];
        const imageUrl = liveImage.getAttribute("weblense-src").split(",")[1];
        liveImage.getAttribute("weblense-latest") === "true"
          ? (imageLatest = true)
          : (imageLatest = false);
        liveImage.src =
          "https://weblense.co/lense/" +
          imageSize +
          "/?url=" +
          imageUrl +
          "&latest=" +
          imageLatest;
      });
      return true;
    },
    loadById: function (id) {
      const liveImage = document.getElementById(id);
      let imageLatest = false;
      const imageSize = liveImage.getAttribute("weblense-src").split(",")[0];
      const imageUrl = liveImage.getAttribute("weblense-src").split(",")[1];
      liveImage.getAttribute("weblense-latest") === "true"
        ? (imageLatest = true)
        : (imageLatest = false);
      liveImage.src =
        "https://weblense.co/lense/" +
        imageSize +
        "/?url=" +
        imageUrl +
        "&latest=" +
        imageLatest;
      return true;
    },
    test: function () {
      var xhr = new XMLHttpRequest();
  
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log("Weblense is alive!");
          return true;
        }
      });
      xhr.open("GET", "https://weblense.co/alive");
      xhr.send();
    },
  };
  