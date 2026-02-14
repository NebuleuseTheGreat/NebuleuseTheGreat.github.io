
let database = {};

let activeTeams = [
    { name: "Alpina", color: "#ff9f43" },
    { name: "Syndicates", color: "#bc13fe" },
    { name: "Nightfall", color: "#2ecc71" }
];

let selectedPlayersSet = new Set();
let assignedLeaders = {};

const modal = document.getElementById("info-modal");
const btn = document.getElementById("info-btn");
const span = document.getElementsByClassName("close-modal")[0];

btn.onclick = function () {
    modal.style.display = "block";
}
span.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const content = JSON.parse(e.target.result);

            if (typeof content === 'object' && content !== null) {
                database = content;
                document.getElementById('upload-status').innerHTML = "✅ Database loaded successfully (" + Object.keys(database).length + " players)";

                const btnStep1 = document.getElementById('btn-step-1');
                btnStep1.disabled = false;
                btnStep1.style.opacity = '1';
                btnStep1.style.cursor = 'pointer';
            } else {
                throw new Error("Format invalid");
            }
        } catch (error) {
            alert("Erreur: Le fichier n'est pas un JSON valide. Vérifiez le format (voir Info).");
            console.error(error);
            document.getElementById('upload-status').innerHTML = "❌ Error loading file";
        }
    };
    reader.readAsText(file);
});

function goToStep2() {
    document.getElementById('step-1').style.opacity = '0.5';
    document.getElementById('step-1').style.pointerEvents = 'none';

    document.getElementById('step-2').classList.remove('hidden');
    document.getElementById('step-2').classList.add('fade-in');

    renderTeamsList();
}

function renderTeamsList() {
    const container = document.getElementById('teams-list');
    container.innerHTML = '';

    activeTeams.forEach((team, index) => {
        const card = document.createElement('div');
        card.className = 'team-config-card fade-in';
        card.innerHTML = `
            <button class="remove-btn" onclick="removeTeam(${index})">x</button>
            <div class="color-dot" style="background: ${team.color}; box-shadow: 0 0 15px ${team.color}"></div>
            <div style="font-weight:bold; font-family:'Orbitron'">${team.name}</div>
        `;
        container.appendChild(card);
    });
}

function addNewTeam() {
    const nameInput = document.getElementById('new-team-name');
    const colorInput = document.getElementById('new-team-color');
    const name = nameInput.value.trim();

    if (name && !activeTeams.some(t => t.name === name)) {
        activeTeams.push({ name: name, color: colorInput.value });
        nameInput.value = '';
        renderTeamsList();
    } else {
        alert("Please enter a unique team name.");
    }
}

function removeTeam(index) {
    if (activeTeams.length <= 2) {
        alert("You need at least 2 teams.");
        return;
    }
    activeTeams.splice(index, 1);
    renderTeamsList();
}

function goToStep3() {
    document.getElementById('step-2').style.opacity = '0.5';
    document.getElementById('step-2').style.pointerEvents = 'none';

    const leadersContainer = document.getElementById('leaders-container');
    leadersContainer.innerHTML = '';

    const sortedNames = Object.keys(database).sort();

    activeTeams.forEach(team => {
        const wrapper = document.createElement('div');

        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '8px';
        label.style.color = team.color;
        label.style.fontWeight = 'bold';
        label.innerText = team.name + " LEADER";

        const select = document.createElement('select');
        select.id = `leader-select-${team.name}`;
        select.dataset.team = team.name;
        select.onchange = updateLeadersAndPool;

        let defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.text = "-- Select --";
        select.appendChild(defaultOption);

        sortedNames.forEach(name => {
            let option = document.createElement('option');
            option.value = name;
            option.text = name;
            select.appendChild(option);
        });

        wrapper.appendChild(label);
        wrapper.appendChild(select);
        leadersContainer.appendChild(wrapper);
    });

    document.getElementById('step-3').classList.remove('hidden');
    document.getElementById('step-3').classList.add('fade-in');
    document.getElementById('step-4').classList.remove('hidden');
    document.getElementById('step-4').classList.add('fade-in');

    renderPlayerPool();
}

function updateLeadersAndPool() {
    assignedLeaders = {};
    activeTeams.forEach(team => {
        const select = document.getElementById(`leader-select-${team.name}`);
        if (select.value) {
            assignedLeaders[team.name] = select.value;
        }
    });
    renderPlayerPool();
}

function togglePlayer(name) {
    if (Object.values(assignedLeaders).includes(name)) return;

    if (selectedPlayersSet.has(name)) {
        selectedPlayersSet.delete(name);
    } else {
        selectedPlayersSet.add(name);
    }
    renderPlayerPool();
}

function renderPlayerPool() {
    const poolContainer = document.getElementById('player-pool');
    poolContainer.innerHTML = '';

    const sortedNames = Object.keys(database).sort();
    const leaders = Object.values(assignedLeaders);

    sortedNames.forEach(name => {
        const chip = document.createElement('div');
        chip.className = 'player-chip';

        if (leaders.includes(name)) {
            chip.classList.add('is-leader');
            chip.innerHTML = `<span>👑 ${name}</span>`;
        } else {
            if (selectedPlayersSet.has(name)) {
                chip.classList.add('selected');
            }
            chip.onclick = () => togglePlayer(name);
            chip.innerHTML = `<span>${name}</span>`;
        }

        poolContainer.appendChild(chip);
    });

    document.getElementById('count-selected').innerText = selectedPlayersSet.size;
}

function generateTeams() {
    const currentLeaders = Object.values(assignedLeaders);
    if (currentLeaders.length !== activeTeams.length) {
        alert("Please assign a leader to every team.");
        return;
    }
    if (new Set(currentLeaders).size !== currentLeaders.length) {
        alert("A player cannot lead two teams.");
        return;
    }

    let teamsData = {};
    let totals = {};

    activeTeams.forEach(t => {
        teamsData[t.name] = [];
        totals[t.name] = 0;

        let leaderName = assignedLeaders[t.name];
        teamsData[t.name].push({ name: leaderName, isLeader: true });
        totals[t.name] += database[leaderName];
    });

    let pool = [];
    selectedPlayersSet.forEach(name => {
        if (!currentLeaders.includes(name)) {
            pool.push({ name: name, score: database[name] });
        }
    });

    pool.sort((a, b) => b.score - a.score);

    pool.forEach(player => {
        let minTotal = Math.min(...Object.values(totals));
        let candidates = activeTeams.filter(t => totals[t.name] === minTotal);
        let chosenTeamObj = candidates[Math.floor(Math.random() * candidates.length)];
        let chosenTeamName = chosenTeamObj.name;

        teamsData[chosenTeamName].push({ name: player.name, isLeader: false });
        totals[chosenTeamName] += player.score;
    });

    displayResults(teamsData);
}

function displayResults(teamsData) {
    const resultsArea = document.getElementById('results-area');
    const output = document.getElementById('teams-output');
    output.innerHTML = '';

    activeTeams.forEach((teamObj, index) => {
        const members = teamsData[teamObj.name];

        let html = `
            <div class="team-card fade-in" style="animation-delay: ${index * 0.1}s; border-top: 4px solid ${teamObj.color}">
                <div class="team-header">
                    <div class="team-title" style="color:${teamObj.color}">${teamObj.name}</div>
                </div>
                <div style="display:flex; flex-direction:column; gap:5px;">
        `;

        members.forEach(m => {
            if (m.isLeader) {
                html += `<div class="player-item leader-item" style="color:${teamObj.color}">
                            👑 ${m.name}
                         </div>`;
            } else {
                html += `<div class="player-item">
                            ${m.name}
                         </div>`;
            }
        });

        html += `</div>
                 <div style="margin-top:15px; font-size:0.8rem; text-align:right; opacity:0.5">
                    Squad Size: ${members.length}
                 </div>
            </div>`;

        output.innerHTML += html;
    });

    resultsArea.style.display = 'block';
    setTimeout(() => {
        resultsArea.style.opacity = '1';
        resultsArea.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}