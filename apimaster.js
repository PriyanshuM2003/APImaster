//! Utility function to get DOM elt from string
function getElementFromString(string) {
  let div = document.createElement("div");
  div.innerHTML = string;
  return div.firstElementChild;
}

//! no. of parametes
let addedParaCount = 0;

//! hide parameter box initially
let parametersBox = document.getElementById("parametersBox");
parametersBox.style.display = "none";

//! para box is selected, hide json box
let paraRadio = document.getElementById("paraRadio");
paraRadio.addEventListener("click", () => {
  document.getElementById("JSONBox").style.display = "none";
  document.getElementById("parametersBox").style.display = "block";
});

//! json box is selected, hide para box
let JSONRadio = document.getElementById("JSONRadio");
JSONRadio.addEventListener("click", () => {
  document.getElementById("JSONBox").style.display = "block";
  document.getElementById("parametersBox").style.display = "none";
});

//! adding more parameters
let addPara = document.getElementById("addPara");
addPara.addEventListener("click", () => {
  let para = document.getElementById("paras");
  let string = `<div class="row my-2">
                    <label for="url" class="col-sm-2 col-form-label">Parameter ${addedParaCount + 2
    }</label>
                    <div class="col-md-4">
                        <input type="text" class="form-control" id="parameterKey${addedParaCount + 2
    }" placeholder="Enter Parameter ${addedParaCount + 2
    } Key">
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" id="parameterValue${addedParaCount + 2
    }" placeholder="Enter Parameter ${addedParaCount + 2
    } Value">
                    </div>
                    <button class="btn btn-primary deletePara"> - </button>
                    </div>`;

  //! Converting element string to DOM node
  let paraElement = getElementFromString(string);
  para.appendChild(paraElement);

  //! remove parameters on clicking
  let deletePara = document.getElementsByClassName("deletePara");
  for (item of deletePara) {
    item.addEventListener("click", (e) => {
      e.target.parentElement.remove();
    });
  }
  addedParaCount++;
});

//! Fetch button
let submit = document.getElementById("submit");
submit.addEventListener("click", () => {
  //*wait
  document.getElementById("responsePrism").innerHTML =
    "Please wait... Fetching response...";
  //* Fetching values
  let url = document.getElementById("url").value;
  let requestType = document.querySelector(
    "input[name='requestType']:checked"
  ).value;
  let contentType = document.querySelector(
    "input[name='contentType']:checked"
  ).value;

  //* if para selected, collect all the parameters into object
  if (contentType == "paras") {
    data = {};
    for (let i = 0; i < addedParaCount + 1; i++) {
      if (document.getElementById("parameterKey" + (i + 1)) != undefined) {
        let key = document.getElementById("parameterKey" + (i + 1)).value;
        let value = document.getElementById("parameterValue" + (i + 1)).value;
        data[key] = value;
      }
    }
    data = JSON.stringify(data);
  } else {
    data = document.getElementById("requestJSONText").value;
  }

  //* Log all the values in the console for debugging
  console.log("URL is ", url);
  console.log("requestType is ", requestType);
  console.log("contentType is ", contentType);
  console.log("data is ", data);

  //* Fetching Get request
  if (requestType == "GET") {
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.text())
      .then((text) => {
        document.getElementById("responsePrism").innerHTML = text;
      });
  } else {
    fetch(url, {
      method: "POST",
      body: data,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.text())
      .then((text) => {
        document.getElementById("responsePrism").innerHTML = text;
        Prism.highlightAll()
      });
  }
});
