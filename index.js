const form = document.querySelector('.movieSearch')
const cont = document.querySelector('.content')
const apiCall = 'https://api.tvmaze.com/search/shows?q='

const createElement = (type, clsses = []) => {
  const elem = document.createElement(type)
  clsses.length > 0 && elem.classList.add(clsses)
  return elem
}

const card = function() {
  let e = {poster: createElement('img', 'poster'),
  crd: createElement('a', 'card'),
  p1: createElement('p'),
  p2: createElement('p')};
    e.poster.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoWcWg0E8pSjBNi0TtiZsqu8uD2PAr_K11DA&usqp=CAU'
    e.p1.innerText = 'No name'
    e.p2.innerText = 'No Rating'
    e.crd.append(e.poster,e.p1,e.p2);
  return e;
}

const clearContainer = () => {
  while (cont.hasChildNodes()) {
    let child = cont.firstChild
    cont.removeChild(child)
  }
}

const createCard = info => {
  let c = card();
  if (info != null) {
    info.image != null && (c.poster.src = info.image.medium)
    info.name != null && (c.p1.innerText = info.name)
    info.rating.average && (c.p2.innerText = `Avg Rating: ${info.rating.average} `)
    c.crd.href=info.url;
  }
  return c.crd
}

const makeReq = async value => {
  let name = value.trim().replaceAll(' ', '+')
  let out = fetch(apiCall + name)
    .then(res => res.json())
    .catch(e => undefined)
  return out
}

form.addEventListener('submit', async e => {
  e.preventDefault()
  console.log('submit!!')
  if (this.showName.value.length > 0) {
    clearContainer()
    let requests = await makeReq(this.showName.value)
    if (requests.length > 0) {
      for (let i=0;i<requests.length ;i++){
        let req = requests[i].show;
        req.rating.average===null && (req.rating.average=0); 
        form.minRating.value<=req.rating.average && cont.append(createCard(req));
      } 
    } else {
      let error = createElement('p')
      error.innerText = 'No results found'
      error.style.color="grey";
      cont.appendChild(error)
    }
  }
})

form.rating.addEventListener('change', () => {
  form.querySelector('#rater').classList.toggle('disable')
  form.minRating.value = 0;
})
