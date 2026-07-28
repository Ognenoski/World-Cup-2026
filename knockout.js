async function getKnockout() {
    try {
        const res = await fetch(
            "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json"
        );

        if (!res.ok) {
            throw new Error("Knockout data could not be loaded.");
        }

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

        renderRound(round32.slice(0, 8), "round32-left");
        renderRound(round32.slice(8, 16), "round32-right");

        renderRound(round16.slice(0, 4), "round16-left");
        renderRound(round16.slice(4, 8), "round16-right");

        renderRound(quarter.slice(0, 2), "quarter-left");
        renderRound(quarter.slice(2, 4), "quarter-right");

        renderRound(semi.slice(0, 1), "semi-left");
        renderRound(semi.slice(1, 2), "semi-right");

        renderRound(final, "final");

        renderChampion(final);
    } catch (error) {
        console.error(error);
    }
}

function renderRound(matches, containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.innerHTML = "";

    matches.forEach(match => {
        const card = document.createElement("div");

        card.className = "match";

        let score1 = match.score?.ft?.[0] ?? "-";
        let score2 = match.score?.ft?.[1] ?? "-";

        if (
            match.round === "Final" &&
            score1 !== "-" &&
            score2 !== "-" &&
            score1 === score2
        ) {
            if (match.goals1?.length > 0) {
                score1++;
            } else if (match.goals2?.length > 0) {
                score2++;
            }
        }

        const team1 = match.team1 || "TBD";
        const team2 = match.team2 || "TBD";

        card.innerHTML = `
            <div class="team">
                <span class="team-name">${team1}</span>
                <span class="score">${score1}</span>
            </div>

            <div class="team">
                <span class="team-name">${team2}</span>
                <span class="score">${score2}</span>
            </div>
        `;

        card.addEventListener("click", () => {
            showMatchPopup(match);
        });

        container.appendChild(card);
    });
}

function showMatchPopup(match) {
    let popup = document.getElementById("knockout-popup");

    if (!popup) {
        popup = document.createElement("div");
        popup.id = "knockout-popup";

        popup.style.cssText = `
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.82);
            justify-content: center;
            align-items: center;
            z-index: 9999;
            padding: 20px;
            backdrop-filter: blur(5px);
        `;

        popup.innerHTML = `
            <div id="knockout-popup-content"></div>
        `;

        popup.addEventListener("click", event => {
            if (event.target === popup) {
                popup.style.display = "none";
            }
        });

        document.body.appendChild(popup);
    }

    const popupContent = document.getElementById(
        "knockout-popup-content"
    );

    const score1 = match.score?.ft?.[0] ?? "-";
    const score2 = match.score?.ft?.[1] ?? "-";

    const team1 = match.team1 || "TBD";
    const team2 = match.team2 || "TBD";

    const goals1 = createGoalsHTML(match.goals1);
    const goals2 = createGoalsHTML(match.goals2);

    const date = match.date
        ? new Date(match.date).toLocaleDateString()
        : "TBD";

    const stadium =
        match.ground ||
        match.stadium ||
        "TBD";

    const round =
        match.round ||
        match.stage ||
        "Knockout Stage";

    popupContent.style.cssText = `
        position: relative;
        width: min(720px, 100%);
        max-height: 90vh;
        overflow-y: auto;
        background:
            linear-gradient(
                145deg,
                rgba(35, 35, 35, 0.99),
                rgba(8, 8, 8, 0.99)
            );
        color: white;
        border: 2px solid gold;
        border-radius: 18px;
        padding: 28px;
        box-shadow:
            0 0 30px rgba(255, 215, 0, 0.5),
            inset 0 0 12px rgba(255, 255, 255, 0.03);
    `;

    popupContent.innerHTML = `
        <button id="close-knockout-popup"
            style="
                position: absolute;
                top: 12px;
                right: 14px;
                width: 36px;
                height: 36px;
                border: 2px solid gold;
                border-radius: 50%;
                background: gold;
                color: black;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
            ">
            ×
        </button>

        <h2 style="
            color: gold;
            text-align: center;
            font-size: 30px;
            margin: 20px 35px 12px;
        ">
            ${team1} ${score1} : ${score2} ${team2}
        </h2>

        <div style="
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 12px 25px;
            margin-bottom: 24px;
            color: #cccccc;
            text-align: center;
        ">
            <span>📅 ${date}</span>
            <span>🏟️ ${stadium}</span>
            <span>🏆 ${round}</span>
        </div>

        <div style="
            display: flex;
            justify-content: space-between;
            gap: 30px;
        ">
            <div style="
                flex: 1;
                background: rgba(255, 255, 255, 0.05);
                padding: 18px;
                border-radius: 12px;
            ">
                <h3 style="
                    color: gold;
                    text-align: center;
                    margin-bottom: 15px;
                ">
                    ${team1}
                </h3>

                ${goals1}
            </div>

            <div style="
                flex: 1;
                background: rgba(255, 255, 255, 0.05);
                padding: 18px;
                border-radius: 12px;
            ">
                <h3 style="
                    color: gold;
                    text-align: center;
                    margin-bottom: 15px;
                ">
                    ${team2}
                </h3>

                ${goals2}
            </div>
        </div>
    `;

    document
        .getElementById("close-knockout-popup")
        .addEventListener("click", () => {
            popup.style.display = "none";
        });

    popup.style.display = "flex";
}

function createGoalsHTML(goals) {
    if (!goals || goals.length === 0) {
        return `
            <p style="
                text-align: center;
                color: #aaaaaa;
            ">
                No goals
            </p>
        `;
    }

    return goals.map(goal => {
        const scorer =
            goal.name ||
            goal.scorer ||
            "Unknown player";

        const minute =
            goal.minute ??
            "-";

        return `
            <p style="
                margin: 8px 0;
                padding: 8px;
                background: rgba(255, 215, 0, 0.08);
                border-radius: 8px;
            ">
                ⚽ ${scorer} ${minute}'
            </p>
        `;
    }).join("");
}

function renderChampion(finalMatches) {
    const championContainer = document.getElementById("champion");

    if (!championContainer || finalMatches.length === 0) {
        return;
    }

    const finalMatch = finalMatches[0];

    let score1 = finalMatch.score?.ft?.[0] ?? 0;
    let score2 = finalMatch.score?.ft?.[1] ?? 0;

    if (score1 === score2) {
        if (finalMatch.goals1?.length > 0) {
            score1++;
        } else if (finalMatch.goals2?.length > 0) {
            score2++;
        }
    }

    const champion = score1 > score2
        ? finalMatch.team1
        : finalMatch.team2;

    championContainer.innerHTML = `
        <div>
            <div>🏆</div>
            <div class="champion-name">${champion}</div>
            <div style="margin-top:10px;font-size:18px;">        
            </div>
        </div>
    `;
}


getKnockout();