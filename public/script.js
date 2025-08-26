function getDate(pdate) {
    const date = new Date(pdate);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const res = `${months[date.getMonth()]} / ${date.getDate()} / ${date.getFullYear()}`;
    return res;
}

function displayNote(pnote) {
    const res = `
                <code>
                    ID : ${pnote.id}<br>
                    Titile : ${pnote.title}<br>
                    Contents : ${pnote.contents}<br>
                    Created : ${getDate(pnote.created)}
                </code>
            `;
    return res;
}

async function createNote() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const response = await fetch('/create-note', {
        method: 'POST',
        headers: {
            "content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            content: content
        })
    });

    const [data] = await response.json();

    console.log(data);
    document.getElementById('response').innerHTML = `
                -- Inserted<br>
                ${displayNote(data)}
            `;

    document.getElementById('title').value = "";
    document.getElementById('content').value = "";
}

function handleSelectChange() {
    const dropdown = document.getElementById("dropdown");
    const selectedValue = dropdown.value;
    const display = document.getElementById('display');
    display.innerHTML = "";

    if (selectedValue === "all") {
        document.getElementById('num').style.display = "none";
        showAllNotes();
    } else if (selectedValue === "id") {
        idInput();
    } else if (selectedValue === "date"){
        
    } else {
        num.innerHTML = '';
        display.innerHTML = "";
    }
}

function idInput() {
    document.getElementById('num').style.display = "block";
    const num = document.getElementById('num');
    num.innerHTML = '';
    let input = document.createElement('input');
    input.setAttribute('id', 'idnum');
    input.setAttribute('type', 'number');
    input.setAttribute('placeholder', 'Enter ID');
    input.setAttribute('required', '');
    num.appendChild(input);

    input.addEventListener('input', function () {
        if (input.value) {
            showNoteById();
        } else {
            display.innerHTML = '';
        }
    });
}

async function showAllNotes() {
    const response = await fetch('/notes');
    const data = await response.json();
    console.log(data);
    data.forEach((index) => {
        const li = document.createElement('li');
        li.innerHTML = displayNote(index);
        display.appendChild(li);
    });
}

async function showNoteById() {
    const id = document.getElementById('idnum').value;
    const response = await fetch(`/notes/${id}`);

    if (!response.ok) {
        document.getElementById('display').innerHTML = `Note with ID ${id} does not exist`;
        return;
    }
    const [data] = await response.json();

    if (data && data.id) {
        document.getElementById('display').innerHTML = displayNote(data);
    } else {
        document.getElementById('display').innerHTML = `<span class="error-message">Note with ID ${id} does not exist</span>`;
    }
}