// JavaScript untuk halaman profil tim
import { ligaData } from "../data/data.js";

document.addEventListener("DOMContentLoaded", function () {
  try {
    // Cek apakah data tersedia
    if (typeof ligaData === "undefined") {
      throw new Error("Data liga tidak tersedia");
    }

    // Ambil nama tim dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const teamParam = urlParams.get("team");

    if (teamParam) {
      renderTeamProfile(teamParam);
    } else {
      // Ambil dari nama file jika tidak ada parameter
      const fileName = window.location.pathname.split("/").pop();
      const teamSlug = fileName
        .replace("team-profile-", "")
        .replace(".html", "");
      const teamName = findTeamBySlug(teamSlug);

      if (teamName) {
        renderTeamProfile(teamName);
      } else {
        showErrorMessage("Tim tidak ditemukan");
      }
    }
  } catch (error) {
    console.error("Error loading team profile:", error);
    showErrorMessage("Gagal memuat profil tim. Silakan refresh halaman.");
  }
});

function renderTeamProfile(teamName) {
  const teamData = getTeamData(teamName);

  if (!teamData) {
    showErrorMessage("Data tim tidak ditemukan");
    return;
  }

  // Update title halaman
  document.title = `${teamData.name} - Liga Pemkab`;

  // Update logo
  const logoElement = document.getElementById("team-logo");
  if (logoElement) {
    logoElement.src =
      teamData.profile.logo || "../images/logos/default-logo.png";
    logoElement.alt = `Logo ${teamData.name}`;
    logoElement.onerror = function () {
      this.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMUU5MEZGIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iNDBweCIgZm9udC1mYW1pbHk9IkFyaWFsIj7ijrs8L3RleHQ+Cjwvc3ZnPgo=";
    };
  }

  // Update nama tim
  const nameElement = document.getElementById("team-name");
  if (nameElement) {
    nameElement.textContent = teamData.name;
  }

  // Update informasi tim
  const foundedElement = document.getElementById("team-founded");
  const stadiumElement = document.getElementById("team-stadium");
  const coachElement = document.getElementById("team-coach");
  const descriptionElement = document.getElementById("team-description");

  if (foundedElement) foundedElement.textContent = teamData.profile.founded;
  if (stadiumElement) stadiumElement.textContent = teamData.profile.stadium;
  if (coachElement) coachElement.textContent = teamData.profile.coach;
  if (descriptionElement)
    descriptionElement.textContent = teamData.profile.description;

  // Render komposisi tim
  renderTeamComposition(teamData);
}

function renderTeamComposition(teamData) {
  const compositionContainer = document.getElementById("team-composition");
  if (compositionContainer) {
    let playersHtml = "";
    if (
      teamData.squad &&
      teamData.squad.players &&
      teamData.squad.players.length > 0
    ) {
      playersHtml = `
        <h3>Daftar Pemain</h3>
        <ul class="player-list">
          ${teamData.squad.players
            .map(
              (player) =>
                `<li>${player.number}. ${player.name} (${player.position})</li>`
            )
            .join("")}
        </ul>
      `;
    }

    compositionContainer.innerHTML = `
      <div class="team-composition-section">
        <h3>Manajer</h3>
        <p>${
          teamData.squad && teamData.squad.manager
            ? teamData.squad.manager
            : "N/A"
        }</p>
      </div>
      ${playersHtml}
    `;
  }
}

function getTeamData(teamName) {
  if (!ligaData.teams) return null;
  return ligaData.teams.find(
    (team) =>
      team.name === teamName ||
      team.name.toLowerCase().includes(teamName.toLowerCase())
  );
}

function findTeamBySlug(slug) {
  if (!ligaData.teams) return null;
  
  // Kasus khusus untuk Inspektorat™
  if (slug === "inspektorat-tm") {
    const inspektoratTeam = ligaData.teams.find(team => team.name.includes("Inspektorat"));
    return inspektoratTeam ? inspektoratTeam.name : null;
  }

  const team = ligaData.teams.find((team) => {
    const teamSlug = slugify(team.name);
    return teamSlug === slug;
  });

  return team ? team.name : null;
}

function getTeamPosition(teamName) {
  if (!ligaData.standings) return "-";

  // Urutkan berdasarkan poin
  const sortedStandings = [...ligaData.standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const goalDiffA = a.gf - a.ga;
    const goalDiffB = b.gf - b.ga;
    if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
    return b.gf - a.gf;
  });

  const position =
    sortedStandings.findIndex((team) => team.team === teamName) + 1;
  return position > 0 ? position : "-";
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function showErrorMessage(message) {
  const mainContent = document.querySelector(".team-profile");
  if (mainContent) {
    mainContent.innerHTML = `
            <div class="error-message">
                <h2>Error</h2>
                <p>${message}</p>
                <a href="../index.html" class="back-link">Kembali ke Beranda</a>
            </div>
        `;
  }
}

// Tambahkan style khusus untuk halaman profil tim
const additionalStyles = `
<style>
.team-composition-section {
    margin-bottom: 1.5rem;
}

.team-composition-section h3,
.player-list h3 {
    color: #1E90FF;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid #eee;
    padding-bottom: 0.5rem;
}

.team-composition-section p {
    font-size: 1.1rem;
    color: #333;
    line-height: 1.6;
}

.player-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 0.5rem;
}

.player-list li {
    background: #f8f9ff;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    font-size: 1rem;
    color: #555;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s ease;
}

.player-list li:hover {
    border-color: #1E90FF;
    box-shadow: 0 2px 8px rgba(30, 144, 255, 0.1);
    transform: translateY(-1px);
}

@media (max-width: 768px) {
    .player-list {
        grid-template-columns: 1fr;
    }
}

</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML("beforeend", additionalStyles);
