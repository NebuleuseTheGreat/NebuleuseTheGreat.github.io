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
btn.onclick = () => modal.style.display = "block";
span.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

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
                document.getElementById('upload-status').innerHTML = "✅ Database loaded (" + Object.keys(database).length + " players)";
                const btnStep1 = document.getElementById('btn-step-1');
                btnStep1.disabled = false; btnStep1.style.opacity = '1'; btnStep1.style.cursor = 'pointer';
            } else throw new Error();
        } catch (error) {
            alert("Erreur: JSON invalide.");
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
    const name = document.getElementById('new-team-name').value.trim();
    const color = document.getElementById('new-team-color').value;
    if (name && !activeTeams.some(t => t.name === name)) {
        activeTeams.push({ name, color });
        document.getElementById('new-team-name').value = '';
        renderTeamsList();
    } else alert("Unique team name required.");
}
function removeTeam(index) {
    if (activeTeams.length <= 2) { alert("Min 2 teams."); return; }
    activeTeams.splice(index, 1);
    renderTeamsList();
}

function goToStep3() {
    document.getElementById('step-2').style.opacity = '0.5';
    document.getElementById('step-2').style.pointerEvents = 'none';

    const leadersContainer = document.getElementById('leaders-container');
    leadersContainer.innerHTML = '';

    activeTeams.forEach(team => {

        const wrapper = document.createElement('div');
        wrapper.className = "leader-input-wrapper";

        const label = document.createElement('label');
        label.style.display = 'block'; label.style.marginBottom = '8px';
        label.style.color = team.color; label.style.fontWeight = 'bold';
        label.innerText = team.name + " LEADER";

        const input = document.createElement('input');
        input.type = "text";
        input.placeholder = "Type to search...";
        input.id = `input-leader-${team.name}`;
        input.autocomplete = "off";

        const resultsList = document.createElement('div');
        resultsList.className = "search-results-list";
        resultsList.id = `results-leader-${team.name}`;

        input.addEventListener('keyup', (e) => filterLeaderList(e.target.value, team.name));
        input.addEventListener('focus', (e) => filterLeaderList(e.target.value, team.name));

        document.addEventListener('click', function (e) {
            if (e.target !== input) resultsList.classList.remove('show');
        });

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        wrapper.appendChild(resultsList);
        leadersContainer.appendChild(wrapper);
    });

    document.getElementById('step-3').classList.remove('hidden');
    document.getElementById('step-3').classList.add('fade-in');
    document.getElementById('step-4').classList.remove('hidden');
    document.getElementById('step-4').classList.add('fade-in');

    renderPlayerPool();
}

function filterLeaderList(query, teamName) {
    const listContainer = document.getElementById(`results-leader-${teamName}`);
    listContainer.innerHTML = '';

    const allPlayers = Object.keys(database).sort();
    const currentLeaders = Object.values(assignedLeaders);

    const matches = allPlayers.filter(name => {
        const isMatch = name.toLowerCase().includes(query.toLowerCase());
        const isTaken = currentLeaders.includes(name) && assignedLeaders[teamName] !== name;
        return isMatch && !isTaken;
    });

    if (matches.length > 0) {
        listContainer.classList.add('show');
        matches.forEach(name => {
            const item = document.createElement('div');
            item.className = 'result-item';
            item.innerText = name;
            item.onclick = () => selectLeader(teamName, name);
            listContainer.appendChild(item);
        });
    } else {
        listContainer.classList.remove('show');
    }
}

function selectLeader(teamName, playerName) {
    assignedLeaders[teamName] = playerName;

    const input = document.getElementById(`input-leader-${teamName}`);
    input.value = playerName;

    document.getElementById(`results-leader-${teamName}`).classList.remove('show');

    renderPlayerPool();

    if (selectedPlayersSet.has(playerName)) {
        selectedPlayersSet.delete(playerName);
        document.getElementById('count-selected').innerText = selectedPlayersSet.size;
    }
}

function filterPlayers() {
    const query = document.getElementById('player-search-input').value.toLowerCase();
    const chips = document.getElementsByClassName('player-chip');

    Array.from(chips).forEach(chip => {
        const playerName = chip.innerText.replace('👑 ', '').toLowerCase();
        if (playerName.includes(query)) {
            chip.classList.remove('hidden');
        } else {
            chip.classList.add('hidden');
        }
    });
}

function togglePlayer(name) {
    if (Object.values(assignedLeaders).includes(name)) return;
    if (selectedPlayersSet.has(name)) selectedPlayersSet.delete(name);
    else selectedPlayersSet.add(name);
    renderPlayerPool();
}

function renderPlayerPool() {
    const poolContainer = document.getElementById('player-pool');
    const currentSearch = document.getElementById('player-search-input') ? document.getElementById('player-search-input').value : "";

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
            if (selectedPlayersSet.has(name)) chip.classList.add('selected');
            chip.onclick = () => togglePlayer(name);
            chip.innerHTML = `<span>${name}</span>`;
        }
        poolContainer.appendChild(chip);
    });

    document.getElementById('count-selected').innerText = selectedPlayersSet.size;

    if (currentSearch) filterPlayers();
}

function generateTeams() {
    const currentLeaders = Object.values(assignedLeaders);
    if (currentLeaders.length !== activeTeams.length) {
        alert("Please assign a leader to every team.");
        return;
    }
    if (new Set(currentLeaders).size !== currentLeaders.length) {
        alert("Leaders must be unique.");
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
        if (!currentLeaders.includes(name)) pool.push({ name: name, score: database[name] });
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
                <div class="team-header"><div class="team-title" style="color:${teamObj.color}">${teamObj.name}</div></div>
                <div style="display:flex; flex-direction:column; gap:5px;">
        `;
        members.forEach(m => {
            html += m.isLeader
                ? `<div class="player-item leader-item" style="color:${teamObj.color}">👑 ${m.name}</div>`
                : `<div class="player-item">${m.name}</div>`;
        });
        html += `</div><div style="margin-top:15px; font-size:0.8rem; text-align:right; opacity:0.5">Squad Size: ${members.length}</div></div>`;
        output.innerHTML += html;
    });
    resultsArea.style.display = 'block';
    setTimeout(() => { resultsArea.style.opacity = '1'; resultsArea.scrollIntoView({ behavior: 'smooth' }); }, 100);
}