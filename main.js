var $allPromotionsData = [];
var $newCustomersData = [];
var isCustomers = false;
fetch('https://run.mocky.io/v3/484016a8-3cdb-44ad-97db-3e5d20d84298')
  .then(res => res.json())
  .then(result => {
    result.sort(sortBySequence);
    $allPromotionsData = result;
    $newCustomersData = result;
    initEvents();
  })
  .catch(error => console.log(error))


function sortBySequence(a, b) {
  return a.sequence < b.sequence ? -1 : a.sequence > b.sequence ? 1 : 0;
}

const $allPromotions = document.querySelector('[data-js="all-promotions"]');
const $newCustomers = document.querySelector('[data-js="new-customers"]');
const $renderHtmlDiv = document.querySelector('#renderHtml');

function initEvents() {
  renderAll()
  window.addEventListener('load', renderAll, false);
  $allPromotions.addEventListener('click', renderAll, false);
  $newCustomers.addEventListener('click', renderNew, false);
}

function renderAll() {
  isCustomers = false;
  reset();
  render($allPromotionsData);
}

function reset () {
  $renderHtmlDiv.innerHTML = '';
}

function render(list) {
  for(let i = 0; i < list.length; i++) {
    createElements(list[i])
  }
}

function renderNew() {
  isCustomers = true;
  let filter = $newCustomersData.filter(item => {
    return item.onlyNewCustomers === true;
  });
  reset();
  render(filter);
}

function createElements(item) {
  const $divCard = document.createElement('div');
  var $img;
  if (isCustomers) {
    $img = document.createElement('img');
  }
  const $h3 = document.createElement('h3');
  const $p = document.createElement('p');
  let $divButton;
  let $button1;
  let $button2;
  if (isCustomers) {
    $divButton = document.createElement('div');
    $button1 = document.createElement('button');
    $button2 = document.createElement('button');
  }

  $divCard.setAttribute('class', 'box '+(isCustomers ? 'NewCustomers' : 'draggable AllPromotions'));
  $divCard.setAttribute('draggable', 'true');
  if (isCustomers) {
    $img.setAttribute('src', item.heroImageUrl);
    $divCard.appendChild($img);
  }
  $h3.textContent = item.name;
  $h3.setAttribute('id', item.id);
  $p.textContent = item.description;

  $divCard.appendChild($h3);
  $divCard.appendChild($p);
  if (isCustomers) {
    $button1.textContent = item.termsAndConditionsButtonText;
    $button2.textContent = item.joinNowButtonText;
    $divButton.appendChild($button1);
    $divButton.appendChild($button2);
    $divCard.appendChild($divButton);
  }
  $renderHtmlDiv.appendChild($divCard);

  if (!isCustomers) {
    var listItens = document.querySelectorAll('.draggable');
    [].forEach.call(listItens, function(item) {
      addEventsDragAndDrop(item);
    });
  }
}

/** drag & drop **/
var remove = document.querySelector('.draggable');
var dragSrcEl;
function dragStart(e) {
  this.style.opacity = '0.4';
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
};
 
function dragEnter(e) {
  this.classList.add('over');
}
 
function dragLeave(e) {
  e.stopPropagation();
  this.classList.remove('over');
}
 
function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}
 
function dragDrop(e) {
  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  return false;
}
 
function dragEnd(e) {
  var allReOrder = [];
  var listItens = document.querySelectorAll('.draggable');
  [].forEach.call(listItens, function(item) {
    allReOrder.push($allPromotionsData.find(x => x.id == item.firstChild.id));
    item.classList.remove('over');
  });
  this.style.opacity = '1';
  $allPromotionsData = allReOrder;
}
 
function addEventsDragAndDrop(el) {
  el.addEventListener('dragstart', dragStart, false);
  el.addEventListener('dragenter', dragEnter, false);
  el.addEventListener('dragover', dragOver, false);
  el.addEventListener('dragleave', dragLeave, false);
  el.addEventListener('drop', dragDrop, false);
  el.addEventListener('dragend', dragEnd, false);
}
