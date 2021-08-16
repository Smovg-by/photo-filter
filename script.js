const inputs = document.querySelectorAll(".input");
const reseter = document.querySelector(".btn-reset");
const fileInput = document.querySelector('input[type="file"]');
const root = document.querySelector(":root");
const imgCont = document.querySelector("#img-container");

//load picture from REMOTE feature_START

const base =
  "https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/";
const images = [
  "01.jpg",
  "02.jpg",
  "03.jpg",
  "05.jpg",
  "06.jpg",
  "07.jpg",
  "08.jpg",
  "09.jpg",
  "10.jpg",
  "11.jpg",
  "12.jpg",
  "13.jpg",
  "14.jpg",
  "15.jpg",
  "16.jpg",
  "17.jpg",
  "18.jpg",
  "19.jpg",
  "20.jpg",
];
const btnNext = document.querySelector(".btn-next");
let i = 0;

let now = new Date();
function getDaytime(now) {
  const hours = now.getHours();
  if (hours >= 6 && hours < 12) {
    return "morning";
  } else if (hours >= 12 && hours < 18) {
    return "day";
  } else if (hours >= 18 && hours < 24) {
    return "evening";
  } else if (hours >= 0 && hours < 6) {
    return "night";
  } else {
    return "время не определено";
  }
}

function setImage(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    //console.log("from setImage: src is: " + src);
    document.querySelector("img").setAttribute("src", src);
  };
}

function getImageServer() {
  const dayTime = getDaytime(now);
  // console.log(dayTime);
  // console.log("click");
  const index = i % images.length;
  const imageSrc = base + dayTime + "/" + images[index];
  //console.log("from getImageServer " + imageSrc);
  setImage(imageSrc);
  i++;
}

btnNext.addEventListener("click", getImageServer);
//load picture from REMOTE feature_END

//load picture from local disk feature_START

fileInput.addEventListener("change", uploadLocalImage);
function uploadLocalImage(e) {
  //console.log("1  " + fileInput.files[0]);
  const file = fileInput.files[0]; // input.files – псевдомассив выбранных файлов.
  const reader = new FileReader(); // создаем объект
  reader.onload = () => {
    // событие "загружено"
    const img = new Image(); //запускаем конструктор, создаем новый элемент
    img.src = reader.result; // вносим значение
    imgCont.innerHTML = ""; //обнуляем значение
    imgCont.append(img); // вставляем <img src ='новый файл'>

    //вписываем занчение в элемент imgCont

    //console.log("2  " + fileInput.files[0]);
    let formDataUser = document.querySelector("form");
    formDataUser.reset();
    //document.querySelector('input[type="file"]') = "";
  };
  reader.readAsDataURL(file);
  //console.log("3  " + fileInput.files[0]);
}

//load picture from local disk feature_START

//filter adjuster feature_START
inputs.forEach((element) => {
  element.addEventListener("input", handleInputs);
});

function handleInputs(e) {
  const sizingValue = this.dataset.sizing || "";
  e.target.nextElementSibling.innerHTML = this.value;
  root.style.setProperty(`--${this.name}`, this.value + sizingValue);
}

//filter adjuster feature_END

//reset button feature_START
reseter.addEventListener("click", resetFunc);

function resetFunc() {
  document.querySelector('input[name="blur"]').value = 0;
  document.querySelector('input[name="blur"]').nextElementSibling.innerHTML = 0;
  document.querySelector('input[name="invert"]').value = 0;
  document.querySelector(
    'input[name="invert"]'
  ).nextElementSibling.innerHTML = 0;
  document.querySelector('input[name="sepia"]').value = 0;
  document.querySelector(
    'input[name="sepia"]'
  ).nextElementSibling.innerHTML = 0;
  document.querySelector('input[name="saturate"]').value = 100;
  document.querySelector(
    'input[name="saturate"]'
  ).nextElementSibling.innerHTML = 100;
  document.querySelector('input[name="hue"]').value = 0;
  document.querySelector('input[name="hue"]').nextElementSibling.innerHTML = 0;
  root.style.removeProperty("--blur");
  root.style.removeProperty("--invert");
  root.style.removeProperty("--sepia");
  root.style.removeProperty("--saturate");
  root.style.removeProperty("--hue");
}

//reset button feature_END

//download image feature_START
const canvas = document.querySelector("canvas");
const download = document.querySelector(".btn-save");
download.addEventListener("click", drawImage);
//console.log(imgSrc);

function drawImage() {
  const imgSrc = document.querySelector("img").getAttribute("src");
  //console.log(imgSrc);
  const img = new Image();
  //img.setAttribute("crossOrigin", "anonymous");
  img.src = imgSrc;
  img.crossOrigin = "anonymous";
  img.onload = function () {
    const filters = window.getComputedStyle(document.querySelector("img"))
      .filter;
    canvas.width = img.width;
    canvas.height = img.height;
    // console.log(
    //   "canvas width is: " + canvas.width + "canvas height is: " + canvas.height
    // );
    //canvas.getContext("2d").filter = filters;
    canvas.getContext("2d").filter = getFilt(inputs);
    const ctx = canvas.getContext("2d");
    //console.log(ctx);
    ctx.drawImage(img, 0, 0);
    //console.log(filters);
    imageDownload();
  };
}

function imageDownload() {
  //console.log("click");
  //console.log(canvas.toDataURL());
  var link = document.createElement("a");
  link.download = "download.png";
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
}

function getFilt(arr) {
  //const imgWidth = document.querySelector("img").width;
  const imgHeight = document.querySelector("img").height;
  //const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  //const blurMultWidth = Math.round(canvasWidth / imgWidth);
  const blurMultHeight = Math.round(canvasHeight / imgHeight);
  //console.log('blurMultWidth is: ' + blurMultWidth + '  blurMultHeight is:  ' + blurMultHeight)
  const blurMult = blurMultHeight;
  //blurMult = (blurMultWidth + blurMultHeight);
  blurMult <= 0 ? (blurMult = 1) : blurMult;
  //console.log("blurMult is:  " + blurMult);
  let blur = arr[0].name + "(" + arr[0].value * blurMult + "px" + ") ";
  let invert = arr[1].name + "(" + arr[1].value / 100 + ") ";
  let sepia = arr[2].name + "(" + arr[2].value / 100 + ") ";
  let saturate = arr[3].name + "(" + arr[3].value / 100 + ") ";
  let hue = arr[4].name + "-rotate" + "(" + arr[4].value + "deg" + ")";
  return (res = blur + invert + sepia + saturate + hue);
}


//download image feature_END

// add full-screen feature_START
document
  .querySelector(".openfullscreen")
  .addEventListener("click", toggleFullScreen); // add EVENT-listener

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
// add full-screen feature_END
