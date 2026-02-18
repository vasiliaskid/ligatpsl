// Main JavaScript untuk halaman utama
import { ligaData } from '../data/data.js';

document.addEventListener("DOMContentLoaded", function () {
  try {
    // Cek apakah data tersedia
    if (typeof ligaData === "undefined") {
      throw new Error("Data liga tidak tersedia");
    }

    // Render semua komponen
    renderNextMatches();
    renderStandings();
    renderTopScorers();
    renderRedCards();
    renderYellowCards();
    renderTeamLinks();
    initializeTabs();
  } catch (error) {
    console.error("Error loading data:", error);
    showErrorMessage("Gagal memuat data liga. Silakan refresh halaman.");
  }
});

// Render pertandingan mendatang
function renderNextMatches() {
  const container = document.getElementById("next-matches");

  if (!ligaData.nextMatch || ligaData.nextMatch.length === 0) {
    container.innerHTML =
      '<div class="error-message">Tidak ada pertandingan mendatang saat ini.</div>';
    return;
  }

  const html = ligaData.nextMatch
    .map(
      (match) => `
        <div class="next-match-card">
            <h4>${match.teams}</h4>
            <p><strong>Tanggal:</strong> ${formatDate(match.date)}</p>
            <p><strong>Waktu:</strong> ${match.time}</p>
            <p><strong>Venue:</strong> ${match.venue}</p>
        </div>
    `
    )
    .join("");

  container.innerHTML = html;
}



function renderStandings() {
  const tbody = document.querySelector("#standings-table tbody");

  if (!ligaData.standings || ligaData.standings.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="10" class="error-message">Data klasemen tidak tersedia.</td></tr>';
    return;
  }

  // Urutkan berdasarkan poin, selisih gol, gol masuk
  const sortedStandings = [...ligaData.standings].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const goalDiffA = a.gf - a.ga;
    const goalDiffB = b.gf - b.ga;
    if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
    return b.gf - a.gf;
  });

  const html = sortedStandings
    .map((team, index) => {
      const position = index + 1;
      const positionClass =
        position <= 4 ? `position-${position}` : "position-regular";

      const teamProfile = getTeamProfile(team.team);
      // Use team-specific logo or default logo
      const logoSrc = teamProfile && teamProfile.profile.logo 
        ? teamProfile.profile.logo 
        : `images/logos/default-logo.png`;

      const teamLink = teamProfile
        ? `team-profiles/team-profile-${slugify(team.team)}.html`
        : "#";

      return `
              <tr>
                  <td>
                      <div class="position-circle ${positionClass}">${position}</div>
                  </td>
                  <td class="team-cell">
                      <img src="${logoSrc}" 
                           alt="Logo ${team.team}" 
                           class="team-logo">
                      <a href="${teamLink}" class="team-name">${team.team}</a>
                  </td>
                  <td>${team.played}</td>
                  <td>${team.won}</td>
                  <td>${team.drawn}</td>
                  <td>${team.lost}</td>
                  <td>${team.gf}</td>
                  <td>${team.ga}</td>
                  <td class="${
                    team.gf - team.ga >= 0 ? "positive-gd" : "negative-gd"
                  }">${team.gf - team.ga >= 0 ? "+" : ""}${
        team.gf - team.ga
      }</td>
                  <td><strong>${team.points}</strong></td>
              </tr>
          `;
    })
    .join("");

  tbody.innerHTML = html;

  // Update bracket dengan top 4 tim
  renderBracket();
}

// Render top skor
function renderTopScorers() {
  const tbody = document.getElementById("top-scorers-list");

  if (!ligaData.topScorers || ligaData.topScorers.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="error-message">Data top skor tidak tersedia.</td></tr>';
    return;
  }

  const sortedScorers = [...ligaData.topScorers].sort(
    (a, b) => b.goals - a.goals
  );

  const html = sortedScorers
    .map(
      (scorer) => `
        <tr>
            <td><strong>${scorer.player}</strong></td>
            <td>${scorer.team}</td>
            <td><strong>${scorer.goals}</strong></td>
        </tr>
    `
    )
    .join("");

  tbody.innerHTML = html;
}

// Render kartu merah
function renderRedCards() {
  const tbody = document.getElementById("red-cards-list");

  if (!ligaData.redCards || ligaData.redCards.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="loading-message">Tidak ada kartu merah tercatat.</td></tr>';
    return;
  }

  const sortedCards = [...ligaData.redCards].sort((a, b) => b.count - a.count);

  const html = sortedCards
    .map(
      (card) => `
        <tr>
            <td><strong>${card.player}</strong></td>
            <td>${card.team}</td>
            <td><span style="color: #f44336;"><strong>${card.count}</strong></span></td>
        </tr>
    `
    )
    .join("");

  tbody.innerHTML = html;
}

// Render kartu kuning
function renderYellowCards() {
  const tbody = document.getElementById("yellow-cards-list");

  if (!ligaData.yellowCards || ligaData.yellowCards.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="loading-message">Tidak ada kartu kuning tercatat.</td></tr>';
    return;
  }

  const sortedCards = [...ligaData.yellowCards].sort(
    (a, b) => b.count - a.count
  );

  const html = sortedCards
    .map(
      (card) => `
        <tr>
            <td><strong>${card.player}</strong></td>
            <td>${card.team}</td>
            <td><span style="color: #ff9800;"><strong>${card.count}</strong></span></td>
        </tr>
    `
    )
    .join("");

  tbody.innerHTML = html;
}

// Render link tim
function renderTeamLinks() {
  const container = document.getElementById("team-links");

  if (!ligaData.teams || ligaData.teams.length === 0) {
    container.innerHTML =
      '<div class="error-message">Data tim tidak tersedia.</div>';
    return;
  }

  const html = `<div class="team-links-grid">` +
    ligaData.teams
      .map(
        (team) => `
          <a href="team-profiles/team-profile-${slugify(
            team.name
          )}.html" class="team-link-item">
              <img src="${team.profile.logo || 'images/logos/default-logo.png'}" alt="Logo ${team.name}" class="team-link-logo">
              <span>${team.name}</span>
          </a>
      `
      )
      .join("") +
    `</div>`;

  container.innerHTML = html;
}

// Initialize tabs functionality
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.getAttribute("data-tab");

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      this.classList.add("active");
      document.getElementById(targetTab).classList.add("active");
    });
  });
}

function renderBracket() {
  if (!ligaData.playoff || !ligaData.playoff.semifinals) {
    return;
  }

  const semifinals = ligaData.playoff.semifinals;
  const finalMatch = ligaData.playoff.final;

  const sf1 = semifinals[0];
  const sf2 = semifinals[1];

  if (sf1) {
    const sf1HomeText =
      sf1.penalties && sf1.penalties.home != null
        ? `${sf1.homeTeam} ${sf1.homeScore} (${sf1.penalties.home})`
        : `${sf1.homeTeam} ${sf1.homeScore}`;

    const sf1AwayText =
      sf1.penalties && sf1.penalties.away != null
        ? `${sf1.awayTeam} ${sf1.awayScore} (${sf1.penalties.away})`
        : `${sf1.awayTeam} ${sf1.awayScore}`;

    renderBracketTeam("sf1-home", sf1.homeTeam, sf1HomeText);
    renderBracketTeam("sf1-away", sf1.awayTeam, sf1AwayText);
  }

  if (sf2) {
    const sf2HomeText =
      sf2.penalties && sf2.penalties.home != null
        ? `${sf2.homeTeam} ${sf2.homeScore} (${sf2.penalties.home})`
        : `${sf2.homeTeam} ${sf2.homeScore}`;

    const sf2AwayText =
      sf2.penalties && sf2.penalties.away != null
        ? `${sf2.awayTeam} ${sf2.awayScore} (${sf2.penalties.away})`
        : `${sf2.awayTeam} ${sf2.awayScore}`;

    renderBracketTeam("sf2-home", sf2.homeTeam, sf2HomeText);
    renderBracketTeam("sf2-away", sf2.awayTeam, sf2AwayText);
  }

  if (finalMatch) {
    const finalHomeText =
      finalMatch.homeScore != null
        ? `${finalMatch.homeTeam} ${finalMatch.homeScore}`
        : finalMatch.homeTeam;

    const finalAwayText =
      finalMatch.awayScore != null
        ? `${finalMatch.awayTeam} ${finalMatch.awayScore}`
        : finalMatch.awayTeam;

    renderBracketTeam("final-home", finalMatch.homeTeam, finalHomeText);
    renderBracketTeam("final-away", finalMatch.awayTeam, finalAwayText);
  }
}

// Utility functions
function getTeamLogoSrc(teamName) {
  const teamProfile = getTeamProfile(teamName);
  if (teamProfile && teamProfile.profile && teamProfile.profile.logo) {
    return teamProfile.profile.logo;
  }
  return "images/logos/default-logo.png";
}

function renderBracketTeam(elementId, teamName, displayText) {
  const element = document.getElementById(elementId);
  if (!element || !teamName) return;

  const logoSrc = getTeamLogoSrc(teamName);
  element.innerHTML = `
    <img src="${logoSrc}" alt="Logo ${teamName}" class="bracket-team-logo">
    <span>${displayText}</span>
  `;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("id-ID", options);
}

function getTeamProfile(teamName) {
  if (!ligaData.teams) return null;
  return ligaData.teams.find((team) => team.name === teamName);
}

function slugify(text) {
  // Kasus khusus untuk Inspektorat™
  if (text.includes("Inspektorat™")) {
    return "inspektorat-tm";
  }
  
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Hapus karakter khusus
    .replace(/[\s_-]+/g, "-") // Ganti spasi dan underscore dengan dash
    .replace(/^-+|-+$/g, ""); // Hapus dash di awal dan akhir
}

function showErrorMessage(message) {
  const errorHtml = `<div class="error-message">${message}</div>`;

  // Tampilkan error di semua container utama
  const containers = [
    "next-matches",
    "standings-table tbody",
    "top-scorers-list",
    "red-cards-list",
    "yellow-cards-list",
    "team-links",
  ];

  containers.forEach((selector) => {
    const element =
      document.querySelector(`#${selector}`) ||
      document.querySelector(selector);
    if (element) {
      if (element.tagName === "TBODY") {
        element.innerHTML = `<tr><td colspan="10">${errorHtml}</td></tr>`;
      } else {
        element.innerHTML = errorHtml;
      }
    }
  });
}
