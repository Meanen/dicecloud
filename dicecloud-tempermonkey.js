// ==UserScript==
// @name     dicecloud
// @version  1
// @grant       GM.setValue
// @grant       GM.getValue
// @match        https://dicecloud.com/character/*
// ==/UserScript==

let hiddenContainers;

const getContainers = () => [
  document.getElementsByClassName("itemContainer", "paper-material-0"),
  document.getElementsByClassName("equipmentContainer"),
  // Feature tab
  [
    document.getElementsByClassName("card", "paper-material-0")[6],
    document.getElementsByClassName("card", "paper-material-0")[7]
  ]
];

const start = () => {
  const containers = getContainers();
  for (let i=0;i<containers.length;i++) {
    for (let j=0;j<containers[i].length;j++) {
      addButton(containers[i][j]);
      hideOnInit(containers[i][j]);
    }
  }
}

const hideOnInit = container => {
  const id = container.attributes['data-id'];
  if (id && contains(id.nodeValue)) {
    toggleContainer(container, false);
  }
}

const addButton = container => {
  const btn = document.createElement("BUTTON");
  btn.innerHTML = "hide";
  btn.setAttribute("class","hide-button");
  btn.onclick = toggleVisibility;
  container.appendChild(btn);
}

const toggleVisibility = event => toggleContainer(event.target.parentElement, true);

const toggleContainer = (container, save) => {
  const sibling = container.children[1];
  sibling.hidden = !sibling.hidden;
  container.children[2].innerHTML = sibling.hidden ? "show" : "hide";
  if (save) {
    const id = container.attributes['data-id'].nodeValue;
    if (contains(id)) {
      hiddenContainers.splice(hiddenContainers.indexOf(id), 1);
    } else {
      hiddenContainers.push(id);
    }
    update(hiddenContainers).then(()=>{});
  }
}

const contains = (id) => hiddenContainers.includes(id);

const waitUntilLoaded = () => {
  if (getContainers()[0].length > 0) {
    start();
  } else {
    setTimeout(waitUntilLoaded, 100);
  }
}

async function init() {
  return await GM.getValue('hiddenContainers', '[]');
}

async function update(val) {
  return await GM.setValue('hiddenContainers', JSON.stringify(val));
}

const setContainers = containers => {
  if (typeof containers === 'string') {
  	hiddenContainers = JSON.parse(containers);
  } else {
  	hiddenContainers = containers;
  }
};

init().then(setContainers);

waitUntilLoaded();
