
async function getWorldCup() {
    const res = await fetch(
        "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json"
    );

    const data = await res.json();
    const groupMatches = data.matches.filter(match => match.group);
    const knockoutMatches = data.matches.filter(match => !match.group);
    knockoutMatches.forEach(match => {
        const team1 = match.team1 || "TBD";
        const team2 = match.team2 || "TBD";
        const stage = match.stage || "TBD";
        const date = match.date ? new Date(match.date).toLocaleDateString() : "TBD";
    });
    const groups = [...new Set(
        groupMatches
            .map(match => match.group)
            .filter(group => group)

    )];


    const flags = {
        "Mexico": "mx",
        "South Africa": "za",
        "Switzerland": "ch",
        "Korea Republic": "kr",
        "Brazil": "br",
        "Germany": "de",
        "France": "fr",
        "Argentina": "ar",
        "Spain": "es",
        "England": "gb",
        "Italy": "it",
        "Portugal": "pt",
        "Netherlands": "nl",
        "Belgium": "be",
        "Croatia": "hr",
        "Denmark": "dk",
        "Serbia": "rs",
        "Poland": "pl",
        "Ukraine": "ua",
        "Austria": "at",
        "Norway": "no",
        "Sweden": "se",
        "Turkey": "tr",
        "Greece": "gr",
        "USA": "us",
        "Canada": "ca",
        "Costa Rica": "cr",
        "Panama": "pa",
        "Jamaica": "jm",
        "Honduras": "hn",
        "Japan": "jp",
        "Australia": "au",
        "Iran": "ir",
        "Saudi Arabia": "sa",
        "Qatar": "qa",
        "United Arab Emirates": "ae",
        "Iraq": "iq",
        "Uzbekistan": "uz",
        "Jordan": "jo",
        "China": "cn",
        "Morocco": "ma",
        "Senegal": "sn",
        "Nigeria": "ng",
        "Egypt": "eg",
        "Algeria": "dz",
        "Tunisia": "tn",
        "Cameroon": "cm",
        "Ghana": "gh",
        "Ivory Coast": "ci",
        "Mali": "ml",
        "Uruguay": "uy",
        "Colombia": "co",
        "Ecuador": "ec",
        "Chile": "cl",
        "Paraguay": "py",
        "Peru": "pe",
        "Venezuela": "ve",
        "Bolivia": "bo",
        "South Korea": "kr",
        "Korea Republic": "kr",
        "Czech Republic": "cz",
        "Bosnia & Herzegovina": "ba",
        "Bosnia and Herzegovina": "ba",
        "Haiti": "ht",
        "Scotland": "gb-sct",
        "New Zealand": "nz",
        "DR Congo": "cd",
        "Congo DR": "cd",
        "Curacao": "cw",
        "USA": "us",
        "United States": "us",
        "Curacao": "cw",
        "Curaçao": "cw",
        "Cape Verde": "cv"
    };
    const displayNames = {
        "Bosnia & Herzegovina": "Bosnia & H.",
    };
    const groupsContainer = document.getElementById("groups");
    groupsContainer.innerHTML = groups.map(group => {

        const teams = [...new Set(
            groupMatches
                .filter(match => match.group === group)
                .flatMap(match => [match.team1, match.team2])
                .filter(team => team)
        )];
        const stats = {};
        teams.forEach(team => {
            stats[team] = {
                mp: 0,
                w: 0,
                d: 0,
                l: 0,
                gd: 0,
                pts: 0
            };
        });
        groupMatches
            .filter(match => match.group === group)
            .forEach(match => {

                if (!match.score || !match.score.ft) return;

                const homeGoals = match.score.ft[0];
                const awayGoals = match.score.ft[1];

                stats[match.team1].mp++;
                stats[match.team2].mp++;

                stats[match.team1].gd += homeGoals - awayGoals;
                stats[match.team2].gd += awayGoals - homeGoals;

                if (homeGoals > awayGoals) {
                    stats[match.team1].w++;
                    stats[match.team1].pts += 3;
                    stats[match.team2].l++;
                } else if (awayGoals > homeGoals) {
                    stats[match.team2].w++;
                    stats[match.team2].pts += 3;
                    stats[match.team1].l++;
                } else {
                    stats[match.team1].d++;
                    stats[match.team2].d++;
                    stats[match.team1].pts++;
                    stats[match.team2].pts++;
                }
            });
        teams.sort((a, b) => {
            if (stats[b].pts !== stats[a].pts) {
                return stats[b].pts - stats[a].pts;
            }

            return stats[b].gd - stats[a].gd;
        });
        return `
<div class="group-card">

    <div class="card-inner">

        <div class="card-front">

            <div class="group">
            <div class="group-header">
    <h3>${group}</h3>
    <button class="flip-btn">See Results</button>
</div>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                            
                                <th>Team</th>
                                <th>MP</th>
                                <th>W</th>
                                <th>D</th>
                                <th>L</th>
                                <th>GD</th>
                                <th>Pts</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${teams.map((team, index) => `
                                <tr class="${index < 2
                                           ? 'qualified'
                                           : index === 2
                                           ? 'playoff'
                                           : ''
                                         }" >
                                    <td>
                                        <div class="team-cell">
                                        <span class="position">${index + 1}.</span>
                                            <img src="https://flagcdn.com/48x36/${flags[team] || 'us'}.png">
                                            <span>${displayNames[team] || team}</span>
                                        </div>
                                    </td>

                                    <td>${stats[team].mp}</td>
                                    <td>${stats[team].w}</td>
                                    <td>${stats[team].d}</td>
                                    <td>${stats[team].l}</td>
                                    <td>${stats[team].gd}</td>
                                    <td>${stats[team].pts}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        <div class="card-back">
        <div class="group-header">
             <h3>${group} Results</h3>
             <button class="flip-btn">Table</button>
</div>
    ${groupMatches
                .filter(match => match.group === group)
                .map(match => `
           <p class="match-result"
    data-team1="${match.team1}"
    data-team2="${match.team2}"
    data-date="${match.date}"
    data-ground="${match.ground || 'TBD'}"
    data-goals1='${JSON.stringify(match.goals1 || [])}'
    data-goals2='${JSON.stringify(match.goals2 || [])}'
    data-score1='${match.score?.ft ? match.score.ft[0] : "-"}'
    data-score2='${match.score?.ft ? match.score.ft[1] : "-"}'
>
    ${match.team1}
    ${match.score?.ft ? match.score.ft[0] : "-"}
    :
    ${match.score?.ft ? match.score.ft[1] : "-"}
    ${match.team2}
</p>
        `).join("")}
        </div>

    </div>

</div>
`
    }).join("");

    const thirdPlacedTeams = [];

    groups.forEach(group => {
        const teams = [...new Set(
            groupMatches
                .filter(match => match.group === group)
                .flatMap(match => [match.team1, match.team2])
        )];

        const stats = {};

        teams.forEach(team => {
            stats[team] = {
                team,
                mp: 0,
                w: 0,
                d: 0,
                l: 0,
                gd: 0,
                pts: 0
            };
        });

        groupMatches
            .filter(match => match.group === group)
            .forEach(match => {

                if (!match.score?.ft) return;

                const homeGoals = match.score.ft[0];
                const awayGoals = match.score.ft[1];

                stats[match.team1].mp++;
                stats[match.team2].mp++;

                stats[match.team1].gd += homeGoals - awayGoals;
                stats[match.team2].gd += awayGoals - homeGoals;

                if (homeGoals > awayGoals) {
                    stats[match.team1].w++;
                    stats[match.team1].pts += 3;
                    stats[match.team2].l++;
                } else if (awayGoals > homeGoals) {
                    stats[match.team2].w++;
                    stats[match.team2].pts += 3;
                    stats[match.team1].l++;
                } else {
                    stats[match.team1].d++;
                    stats[match.team2].d++;
                    stats[match.team1].pts++;
                    stats[match.team2].pts++;
                }
            });

        const sorted = Object.values(stats).sort((a, b) =>
            b.pts - a.pts || b.gd - a.gd
        );

        thirdPlacedTeams.push(sorted[2]);
    });

    thirdPlacedTeams.sort((a, b) =>
        b.pts - a.pts || b.gd - a.gd
    );
    document.getElementById("third-place-table").innerHTML = `
<h2>Best Third-Placed Teams</h2>

<table>
<thead>
<tr>
 <th>Team</th>
 <th></th>
 <th>GD</th>
 <th>Pts</th>
</tr>
</thead>

<tbody>
${thirdPlacedTeams.map((team, index) => `
<tr class="${index < 8 ? 'qualified' : ''}">

<td><div class="team-cell">
        <span class="position">${index + 1}.</span>
        <img src="https://flagcdn.com/48x36/${flags[team.team] || 'us'}.png">
        <span>${displayNames[team.team] || team.team}</span>
    </div></td>
    <td></td>
<td>${team.gd}</td>
<td>${team.pts}</td>
</tr>
`).join("")}
</tbody>
</table>
`;

    document.querySelectorAll(".flip-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".group-card");
            card.classList.toggle("flipped");
        });
    });
    document.querySelectorAll(".match-result").forEach(match => {
        match.addEventListener("click", () => {

            const team1 = match.dataset.team1;
            const team2 = match.dataset.team2;
            const date = match.dataset.date;
            const ground = match.dataset.ground;

            const score1 = match.dataset.score1;
            const score2 = match.dataset.score2;

            const goals1 = JSON.parse(match.dataset.goals1 || "[]");
            const goals2 = JSON.parse(match.dataset.goals2 || "[]");

            const scorers1 = goals1.map(goal =>
                `<p>⚽ ${goal.name} ${goal.minute}'</p>`
            ).join("");

            const scorers2 = goals2.map(goal =>
                `<p>⚽ ${goal.name} ${goal.minute}'</p>`
            ).join("");

            document.getElementById("popup-content").innerHTML = `
<h2>${team1} ${score1}:${score2} ${team2}</h2>

<div class="match-info">
    <span>📅 ${date}</span>
    <span>🏟️ ${ground}</span>
</div>

<div class="teams-container">

    <div class="team-column">
        
        ${scorers1 || "<p>No goals</p>"}
    </div>

    <div class="team-column">
        
        ${scorers2 || "<p>No goals</p>"}
    </div>

</div>
`;

            document.getElementById("popup").style.display = "flex";
        });
    });

    document.getElementById("popup").addEventListener("click", () => {
        document.getElementById("popup").style.display = "none";
    });

}

getWorldCup();