import { $ } from "./utils/dom.js";
import store from "./store/index.js";
import MenuApi from "./api/index.js";

// TODO 서버 요청
// [V] 웹 서버를 띄운다.
// [v] 서버에 새로운 메뉴명을 추가될 수 있도록 요청한다.
// [v] 서버에 카테고리별 메뉴리스트를 요청한다.
// [v] 서버에 메뉴명을 수정할 수 있도록 요청한다.
// [v] 서버에 품절상태를 toggle될 수 있도록 요청한다.
// [v] 서버에 메뉴명을 삭제할 수 있도록 요청한다.

// TODO 리팩터링
// [v] localStorage에 저장하는 로직을 지운다.
// [v] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현
// [v] api 객체를 관리하는 파일 분리

// TODO 사용자 경험
// [v] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리
// [v] 중복되는 메뉴는 추가할 수 없다.

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = 'espresso';
  this.init = async () => {
    render();
    initEventListeners();
  }

  const render = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    const template = this.menu[this.currentCategory].map((item) => {
      return `
          <li data-menu-id="${item.id}" class="menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name ${item.isSoldOut ? "sold-out" : ""}">
              ${item.name}</span>
            <button
              type="button"
              class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
            >
              품절
            </button>
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
    $("#menu-list").innerHTML = template;
    updateMenuCount();
  }

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  }

  const addMenuName = async () => {
    const menuName = $("#menu-name").value;
    if (menuName === "") {
      alert("메뉴를 입력하세요.");
      return;
    }

    const isDuplicatedItem = this.menu[this.currentCategory].find(
      menuItem => menuItem.name === menuName
    );
    if (isDuplicatedItem) {
      alert("이미 등록된 메뉴명입니다. 다시 입력해주세요.");
      $("#menu-name").value = "";
      return;
    }

    await MenuApi.createMenu(this.currentCategory, menuName);
    render();
    $("#menu-name").value = "";
  }

  const updateMenuName = async (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt("메뉴 이름을 수정하세요", $menuName.innerText);
    if (!updatedMenuName) {
      return;
    }
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    render();
  }

  const removeMenuName = async (e) => {
    if (confirm("메뉴를 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      render();
    }
  }

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    render();
  }

  const changeCategory = (e) => {
    const isCategroyButton = e.target.classList.contains("cafe-category-name");
    if (!isCategroyButton) {
      return
    }
    const categoryName = e.target.dataset.categoryName;
    const categoryBtnName = e.target.innerText.substr(2).trim();

    this.currentCategory = categoryName;
    $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
    $("label[for='menu-name']").innerText = `${categoryBtnName} 메뉴 이름`;
    $("#menu-name").placeholder = `${categoryBtnName} 메뉴 이름`;
    render();
  }

  const initEventListeners = () => {
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });

    $("nav").addEventListener("click", changeCategory);
  }
}

const app = new App();
app.init();