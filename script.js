//Fetches all episodes of the TV show with ID 1 from TV Maze API, and calls function makePageForEpisodes with the data received
function setup() {
  const allEpisodes = getAllEpisodes();

  // Display all episodes
  allEpisodes.forEach((episode) => {
    const title = `${episode.name} - S${formatEpisodeNumber(episode.season)}E${formatEpisodeNumber(episode.number)}`;
    const summary = episode.summary ? episode.summary : "No summary available";
    const image = episode.image ? episode.image.medium : "https://via.placeholder.com/210x295?text=No+Image";

    const episodeElement = document.createElement("div");
    episodeElement.classList.add("episode");

    const titleElement = document.createElement("h3");
    titleElement.innerHTML = title;

    const summaryElement = document.createElement("div");
    summaryElement.innerHTML = summary;

    const imageElement = document.createElement("img");
    imageElement.src = image;
    imageElement.alt = title;

    episodeElement.appendChild(titleElement);
    episodeElement.appendChild(summaryElement);
    episodeElement.appendChild(imageElement);

    document.getElementById("root").appendChild(episodeElement);
  });
}

function formatEpisodeNumber(number) {
  return number.toString().padStart(2, "0");
}

window.onload = setup;
