document.addEventListener('DOMContentLoaded', () => {
    const makeRequest = (typeOfReq = "GET", distination = "/booksList", body) => {
        document.body.classList.remove('loaded');
        if(typeOfReq === "GET"){
            return fetch(distination);
        } else if (typeOfReq === "DELETE"){
            if(confirm("Вы уверены, что хотите удалить этот элемент?"))
                return fetch(distination, {method: typeOfReq});
            else
                return new Promise((res, rej) => {});
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

    const start = () => {
        const form = document.getElementById("bookForm"),
            cancelBtn = document.getElementById("cancel"),
            returnBtn = document.getElementById("return"),
            giveBookBtn = document.getElementById("giveBook"),
            returnBookBtn = document.getElementById("returnBook"),
            modal = document.getElementById("modal"),
            modalForm = modal.querySelector('.modal__form'),
            availabilityInp = form.querySelector("[name='inLibrary']"),
            readerNameInp = form.querySelector("[name='readerName']"),
            returnDateInp = form.querySelector("[name='returnDate']");
        let curState = Object.fromEntries(new FormData(form)),
            refreshFlag = true;

        const checkAvail = () => {
            if(availabilityInp.value === "yes"){
                giveBookBtn.style.display = "block";
                returnBookBtn.style.display = "none";
            } else {
                giveBookBtn.style.display = "none";
                returnBookBtn.style.display = "block";
            }
        }

        form.addEventListener('change', e => {
            if(e.target.tagName === "INPUT"){
                refreshFlag = false;
            }
        });
        form.addEventListener('submit', async e => {
            e.preventDefault();
            if(refreshFlag){
                return;
            }
            const formData = new FormData(e.target);
            curState = Object.fromEntries(formData);
            refreshFlag = true; 
            await makeRequest("PUT", document.URL, JSON.stringify(curState));
            document.title = form.querySelector("[name='name']").value;
            document.querySelector('.title').textContent = form.querySelector("[name='name']").value;
            document.body.classList.add('loaded');        
        });

        cancelBtn.addEventListener('click', e => {
            e.preventDefault();
            form.querySelectorAll("input").forEach(item => {
                item.value = curState[item.name];
            });
            checkAvail();
            refreshFlag = true;
        });

        returnBtn.addEventListener('click', e => {
            e.preventDefault();
            if(!refreshFlag){
                if(confirm("У вас остались несохраненные изменения. Все равно покинуть страницу?"))
                    window.location.href = '/';
            } else
                window.location.href = '/';
        });

        giveBookBtn.addEventListener('click', e => {
            e.preventDefault();
            modal.style.display = "flex";
            checkAvail();
        });

        returnBookBtn.addEventListener('click', e => {
            e.preventDefault();
            availabilityInp.value = "yes";
            returnDateInp.value = "";
            readerNameInp.value = "";
            refreshFlag = false;
            checkAvail();
        });

        modalForm.addEventListener('submit', e => {
            e.preventDefault();
            refreshFlag = false;
            availabilityInp.value = "no";
            returnDateInp.value = modalForm.querySelector("[name='returnDate']").value;
            readerNameInp.value = modalForm.querySelector("[name='readerName']").value;
            checkAvail();
            modalForm.reset();
            modal.style.display = "none";
        });
        modal.addEventListener('click', e => {
            if(e.target.closest('.button__close') || e.target.closest('.cancel-button') || e.target.matches('.modal__overlay')){
                modalForm.reset();
                modal.style.display = "none";
            }
        });
    }
    start();
});