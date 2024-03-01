const btnContainer = document.getElementById('btn-container');
const cardContainer = document.getElementById('card-container');
const errorElement = document.getElementById('error-element');
const sortBtn = document.getElementById('sort-btn');
const firstLoad = 1000;
let sortByView = false;
sortBtn.addEventListener('click', () => {
  sortByView = true;
  fetchDataByCategory(firstLoad, sortByView);
});
// const fetchCategory = async () => {
//   const res = await fetch(
//     'https://openapi.programming-hero.com/api/videos/categories'
//   );
//   const data = await res.json();
//   const catagory = data.data;

//   createButton(catagory);
// };
const fetchCategory = () => {
  const url = 'https://openapi.programming-hero.com/api/videos/categories';
  fetch(url)
    .then(res => res.json())
    .then(({ data }) => {
      data.forEach(card => {
        // console.log(card);
        const newBtn = document.createElement('button');
        newBtn.innerText = card.category;
        newBtn.className = 'catagory-btn btn btn-ghost bg-slate-700 text-white';
        newBtn.addEventListener('click', () => {
          fetchDataByCategory(card.category_id, sortByView);
          const allBtn = document.querySelectorAll('.catagory-btn');
          for (const btn of allBtn) {
            btn.classList.remove('bg-red-600');
          }
          newBtn.classList.add('bg-red-600');
        });
        btnContainer.appendChild(newBtn);
      });
    });
};
const fetchDataByCategory = (id, sortByView) => {
  const url = `https://openapi.programming-hero.com/api/videos/category/${id}`;
  fetch(url)
    .then(res => res.json())
    .then(({ data }) => {
      if (sortByView) {
        data.sort((a, b) => {
          const totalViewstringFirst = a.others?.views;
          const totalViewFirstNumber =
            parseFloat(totalViewstringFirst.replace('K', '')) || 0;
          const totalViewstringSecond = b.others?.views;
          const totalViewSecondNumber =
            parseFloat(totalViewstringSecond.replace('K', '')) || 0;
          return totalViewSecondNumber - totalViewFirstNumber;
        });
      }
      cardContainer.innerHTML = '';
      if (data.length === 0) {
        errorElement.classList.remove('hidden');
      } else {
        errorElement.classList.add('hidden');
      }
      data.forEach(card => {
        // console.log(card);
        // console.log(data);
        let verifiedBadge = '';
        if (card.authors[0].verified) {
          verifiedBadge = `<img class="w-6 h-6" src="./verify.png" alt="">`;
        }
        const newCard = document.createElement('div');
        newCard.innerHTML = `<div class="card w-full bg-base-100 shadow-xl">
        <figure class="overflow-hidden h-72">
          <img class="w-full" src="${card.thumbnail}" alt="Shoes" />
          <h6 class="absolute bottom-[40%] right-12">0 hr</h6>
        </figure>
        <div class="card-body">
          <div class="flex space-x-4 justify-start items-start">
            <div>
              <img class="w-12 h-12 rounded-full" src="${card.authors[0].profile_picture}" alt="Shoes" />
            </div>
            <div>
              <h2 class="card-title">${card.title}</h2>
              <div class="flex mt-3">
                <p class="">${card.authors[0].profile_name}</p>
                ${verifiedBadge}
              </div>
              <p class="mt-3">${card.others.views}</p>
            </div>
          </div>
        </div>
      </div>`;
        cardContainer.appendChild(newCard);
      });
    });
};

// const createButton = catagory => {
//   catagory.forEach(card => {
//     console.log(card);
//     const newBtn = document.createElement('button');
//     newBtn.innerText = card.category;
//     btnContainer.appendChild(newBtn);
//   });
// };

fetchCategory();
fetchDataByCategory(firstLoad, sortByView);
