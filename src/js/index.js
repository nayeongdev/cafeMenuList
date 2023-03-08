// TODO localStorage read & write
// - [] localStorage에 데이터를 저장한다.
//  - [v] 메뉴가 추가됐을 때
//  - [] 메뉴가 수정됐을 때
//  - [] 메뉴가 삭제됐을 때
// - [] localStorage에 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
//  -[] 에스프레소, 프라푸치노, 블렌디드, 티바나, 디저트 각각의 종류별로 메뉴판 관리

// TODO 페이지 접근 시 데이터 Read & Rendering
// - [] 페이지에 최초로 접근할 때, 에스프레소 메뉴를 읽어온다.
// - [] 에스프레소 메뉴를 페이지에 그려준다.

// TODO 품절 상태 메뉴의 마크업
// - [] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고`sold-out` class를 추가하여 상태를 변경한다.
// - [] 품절 버튼을 추가한다.
// - [] 품절 버튼을 클릭하면 localStorage의 상태값이 변경된다.
// - [] 버튼 이벤트가 발생한 li태그에 `sold-out` class를 추가하여 상태를 변경한다.


const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    localStorage.getItem("menu");
  }
};

function App() {
  // 상태는 변하는 데이터, 이 앱에서 관리해야 하는 것은 무엇인가 - 메뉴명
  this.menu = [];   // 메뉴가 여러개니까 배열로 초기화

  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  }

  const addMenuName = () => {
    const espressoMenuName = $("#espresso-menu-name").value;

    if (espressoMenuName === "") {
      alert("메뉴를 입력하세요.");
      return;
    }
    this.menu.push({ name: espressoMenuName });
    store.setLocalStorage(this.menu);

    const template = this.menu.map((item, index) => {
      return `
          <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name">${item.name}</span>
            <button
              type="button"
              class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
            >
              수정
            </button>
            <button
              type="button"
              class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
            >
              삭제
            </button>
          </li>`;
    }).join("");

    $("#espresso-menu-list").innerHTML = template;
    updateMenuCount();
    $("#espresso-menu-name").value = "";
  }

  const updateMenuName = (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt("메뉴 이름을 수정하세요", $menuName.innerText);
    if (updatedMenuName) {
      this.menu[menuId].name = updatedMenuName;
      store.setLocalStorage(this.menu);
      $menuName.innerText = updatedMenuName;
    }
  }

  const removeMenuName = (e) => {
    if (confirm("메뉴를 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuID;
      this.menu.splice(menuId, 1)
      store.setLocalStorage(this.menu);
      e.target.closest('li').remove();
      updateMenuCount();
    }
  }

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });


  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();
  });
}

const app = new App();