async function getKnockout() {

    const res = await fetch(
        "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json"
    );

    const data = await res.json();

    const knockoutMatches = data.matches.filter(match => !match.group);

    const round32 = knockoutMatches.filter(
        match => match.round === "Round of 32"
    );

    const round16 = knockoutMatches.filter(
        match => match.round === "Round of 16"
    );

    const quarter = knockoutMatches.filter(
        match => match.round === "Quarter-final"
    );

    const semi = knockoutMatches.filter(
        match => match.round === "Semi-final"
    );

    const final = knockoutMatches.filter(
        match => match.round === "Final"
    );

    console.log(round32.length);
    console.log(round16.length);
    console.log(quarter.length);
    console.log(semi.length);
    console.log(final.length);

    renderRound(round32, "round32");
    renderRound(round16, "round16");
    renderRound(quarter, "quarter");
    renderRound(semi, "semi");
    renderRound(final, "final");
}

function renderRound(matches, containerId) {

    const container = document.getElementById(containerId);

    container.innerHTML = "";

    matches.forEach(match => {

        const card = document.createElement("div");

        card.className = "match";

        const score1 = match.score?.ft
            ? match.score.ft[0]
            : "-";

        const score2 = match.score?.ft
            ? match.score.ft[1]
            : "-";

        card.innerHTML = `
            <div class="team">
                <span>${match.team1}</span>
                <span class="score">${score1}</span>
            </div>

            <div class="team">
                <span>${match.team2}</span>
                <span class="score">${score2}</span>
            </div>
        `;

        container.appendChild(card);

    });

}

getKnockout();