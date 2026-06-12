
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
                <h3>${group}</h3>

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
                            ${teams.map(team => `
                                <tr>
                                    <td>
                                        <div class="team-cell">
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
             <h3>${group} Results</h3>

    ${groupMatches
        .filter(match => match.group === group)
        .map(match => `
            <p>
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
`;
    }).join("");
}

getWorldCup();
