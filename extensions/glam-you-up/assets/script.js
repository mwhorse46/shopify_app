function errorToast(message) {
  console.log("Error Toast");
  let body = document.querySelector("body");
  let toast = document.createElement("p");
  toast.innerHTML = `<span style="font-weight: 700">Error!</span> ${message}`;
  toast.style.cssText =
    "padding: 5px 25px; background-color: #f1807e; color: white; position: fixed; z-index: 999; right: 20px;";
  body.appendChild(toast);
  setTimeout(function () {
    body.removeChild(toast);
  }, 3000);
}

function successToast(message) {
  let body = document.querySelector("body");
  let toast = document.createElement("p");
  toast.innerHTML = `<span style="font-weight: 700">Success!</span> ${message}`;
  toast.style.cssText =
    "padding: 5px 25px; background-color: #7ef180; color: white; position: fixed; z-index: 999; right: 20px;";
  body.appendChild(toast);
  setTimeout(function () {
    body.removeChild(toast);
  }, 3000);
}

function startProgress(time) {
  console.log("Start Progress");
  let body = document.querySelector("body");
  let progressBarBack = document.createElement("div");
  progressBarBack.className = "loader-progress-bar-back";
  progressBarBack.id = "customProgressBar";
  progressBarBack.innerHTML = `
      <div class="loader-progress-bar">
          <div class="loader-progress"> </div>
      </div>`;
  body.appendChild(progressBarBack);
  onProgress(time);
}

function onProgress(time) {
  console.log("On Progress");
  let progressBar = document.querySelector(".loader-progress");
  let progress = 0;
  let targetProgress = 95;
  let duration = time * 1000;
  let interval = setInterval(function () {
    progress++;
    progressBar.style.width = progress + "%";
    if (progress >= targetProgress) {
      clearInterval(interval);
    }
  }, duration / targetProgress);
  console.log("Finished");
}

function endProgress() {
  console.log("End Progress");
  let progressBar = document.getElementById("customProgressBar");
  let progress = document.querySelector(".loader-progress");
  progress.style.width = "100%";
  clearInterval();
  if (progressBar) {
    setTimeout(function () {
      progress.style.width = "0%";
      if (progressBar.parentNode) {
        progressBar.parentNode.removeChild(progressBar);
      }
    }, 200);
  }
}
