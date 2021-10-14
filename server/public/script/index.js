document.addEventListener("DOMContentLoaded", () => {
    const toDate = (string) => {
        const array = string.split('.');
        return new Date(+array[2], +array[1], +array[0]);
    }
    const makeRequest = (typeOfReq = "GET", distination = "/booksList", body) => {
        document.body.classList.remove('loaded');
        if(typeOfReq === "GET"){
            return fetch(distination);
        } else if (typeOfReq === "DELETE"){
            return fetch(distination, {method: typeOfReq});
        }
        else {
            return fetch(distination, {
                method: typeOfReq,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: body
            });
        }
    };

    const updatePage = data => {
        const tbody = document.querySelector('tbody');
        tbody.textContent = "";
        data.forEach(item => {
            tbody.insertAdjacentHTML('beforeend', `
            <tr class="table__row">
                <td class="table__id table__cell">${item.id}</td>
                <td class="table-author table__cell">${item.author}</td>
                <td class="table-name table__cell">${item.name}</td>
                <td class="table-release table__cell">${item.releaseDate}</td>
                <td class="table-availability table__cell">${item.inLibrary}</td>
                <td class="table-return table__cell 
                    ${item.inLibrary === "no" && item.returnDate && toDate(item.returnDate < Date.now() 
                        ? 'expired' : '')}">
                    ${item.inLibrary === "no" && item.returnDate ? item.returnDate : '--'}
                </td>
                <td class="table__cell">
                    <div class="table__actions">
                        <button class="button action-remove">
                            <span class="svg_ui">
                                <svg class="action-icon_remove"><use xlink:href="../public/img/sprite.svg#remove"></use></svg>
                            </span>
                            <span>Удалить</span>
                        </button>
                    </div>
                </td>
            </tr>
            `);
        });
    }
    
    const getData = async () => {
        const resp = await makeRequest();
        if (resp.ok) {
            return await resp.json();
          } else {
            alert("Ошибка HTTP: " + resp.status);
            return;
          }
    }

    const start = async () => {
        let data = await getData();
        document.body.classList.add('loaded');
        const filterSelect = document.getElementById("filterType");
        filterSelect.addEventListener("change", async e => {
            let newData = await makeRequest("GET", `/filter/${e.target.value}`)
            newData = await newData.json();
            updatePage(newData);
            document.body.classList.add('loaded');
        });

        const tbody = document.querySelector("tbody");
        tbody.addEventListener('click', async e => {
            let target = e.target.closest(".action-remove");
            if(target){
                if(!confirm("Вы уверены, что хотите удалить этот элемент?")){
                    return;
                }
                const id = target.closest(".table__row").querySelector(".table__id").textContent;
                data = await makeRequest("DELETE", `/booksList/${id}`);

                data = await data.json();
                updatePage(data);
                document.body.classList.add('loaded');
            } else {
                target = e.target.closest('.table__row');
                if(target){
                    window.location.href = `/booksList/${target.querySelector('.table__id').textContent}`;
                }
            }
        });

        const modal = document.getElementById('modal');
        modal.addEventListener('click', e => {
            if(e.target.closest('.button__close') || e.target.closest('.cancel-button') || e.target.matches('.modal__overlay')){
                modal.querySelector('form').reset();
                modal.style.display = "none";
            }
        });

        const addBtn = document.querySelector(".btn-addItem");
        addBtn.addEventListener('click', () => modal.style.display = 'flex');

        const form = document.querySelector("form");
        form.addEventListener('submit', async e => {
            e.preventDefault();
            modal.style.display = "none";
            let formData = new FormData(e.target);
            formData = JSON.stringify(Object.fromEntries(formData));
            data = await makeRequest("POST", "/", formData);
            data = await data.json();
            updatePage(data);
            document.body.classList.add('loaded');
            form.reset();
        });
    }
    start();
});