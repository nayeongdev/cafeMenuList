// step1 요구사항 - 돔 조작과 이벤트 핸들링으로 메뉴 관리하기
// TODO 메뉴 추가
// - [v] 메뉴의 이름을 입력 받고 엔터키를 누르면 메뉴 추가
// - [v] 메뉴의 이름을 입력 받고 확인 버튼을 누르면 메뉴 추가
// - [v] 추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
// - [v] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [v] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [v] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// TODO 메뉴 수정
// - [v] 메뉴의 수정 버튼을 누르면 메뉴 이름을 수정하는 모달창이 뜬다.
//   (수정시, 브라우저에서 제공하는 `prompt` 인터페이스를 활용한다.)
// - [v] 모달창에서 새로운 메뉴명을 입력 받고, 확인버튼을 누르면 메뉴 수정

// TODO 메뉴 삭제
// - [v] 메뉴 삭제 버튼을 누르면, 메뉴 삭제 컨펌 모달창이 뜬다.
//   (삭제시, 브라우저에서 제공하는 `confirm` 인터페이스를 활용한다.)
// - [v] 확인 버튼을 누르면 메뉴 삭제
// - [v] 총 메뉴 갯수를 count하여 상단에 보여준다.

const $ = (selector) => document.querySelector(selector);

function App() {
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

    const menuItemTemplate = (espressoMenuName) => {
      return `
          <li class="menu-list-item d-flex items-center py-2">
            <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
    };
    $("#espresso-menu-list").insertAdjacentHTML(
      'beforeend',
      menuItemTemplate(espressoMenuName)
    );
    updateMenuCount();
    $("#espresso-menu-name").value = "";
  }

  const updateMenuName = (e) => {
    const $menuName = e.target.closest('li').querySelector('.menu-name');
    const updatedMenuName = prompt("메뉴 이름을 수정하세요", $menuName.innerText);
    if (updatedMenuName) {
      $menuName.innerText = updatedMenuName;
    }
  }

  const deleteMenuName = (e) => {
    if (confirm("메뉴를 삭제하시겠습니까?")) {
      e.target.closest('li').remove();
      updateMenuCount();
    }
  }

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      deleteMenuName(e);
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

App();