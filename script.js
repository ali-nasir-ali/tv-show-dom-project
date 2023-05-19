document.addEventListener("DOMContentLoaded", function () {
  // Get the root element
  var rootElement = document.getElementById("root");

  ///////////////////////// BELOW IS NAV /////////////////////////
  ///////////////////////////////////////////////////////////////
  // Create the top bar
  var topBar = document.createElement("div");
  topBar.setAttribute("class", "top-bar");

  ////
  //
  //
  // Create the search bar
  var searchBar = document.createElement("input");
  searchBar.setAttribute("type", "text");
  searchBar.setAttribute("id", "searchBar");
  searchBar.setAttribute("placeholder", "Search episodes...");
  topBar.appendChild(searchBar);

  ////
  //
  //  creates shows select bar
  function createShowSelect(shows) {
    const showsInput = document.createElement("select");
    showsInput.id = "showsInputBox";
    showsInput.innerHTML = `<option value=""> Shows  </option>`;
    shows.forEach((show) => {
      showsInput.innerHTML += `<option value="${show.id}">${show.name}</option>`;
    });

    return showsInput;
  }

  //
  //
  //
  // Insert the top bar at the top of the root element
  rootElement.insertBefore(topBar, rootElement.firstChild);

  ///////////////////////// ABOVE IS NAV /////////////////////////
  ///////////////////////////////////////////////////////////////
  //
  //
  //

  ///////////////////////// BELOW IS Fetching Data  //////////////
  ///////////////////////////////////////////////////////////////

  //
  // Get all episodes from the episodes.js file
  var allEpisodes = getAllEpisodes();
  ///
  async function fetchAllSeasons(showId) {
    if (showId === "none") {
      return [];
    } else {
      const response = await fetch(`https://api.tvmaze.com/shows/${showId}/seasons`);
      const data = await response.json();
      return data;
    }
  }

  async function fetchShows() {
    return fetch(`https://api.tvmaze.com/shows`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error fetching shows");
        }
      })
      .catch((error) => {
        console.error("Error fetching shows:", error);
      });
  }

  async function fetchAllEpisodesData(show) {
    try {
      const response = await fetch(`https://api.tvmaze.com/shows/${show.id}/episodes`);
      if (response.ok) {
        const episodesData = await response.json();
        return episodesData;
      } else {
        throw new Error(`Error fetching episodes for show ID: ${show.id}`);
      }
    } catch (error) {
      console.error("Error fetching episodes:", error);
      return [];
    }
  }
  //
  //

  ///////////////////////// ABOVE IS Fetching Data ///////////////
  ///////////////////////////////////////////////////////////////

  //
  // Create a container for the episodes
  var episodesContainer = document.createElement("div");
  episodesContainer.setAttribute("id", "episodesContainer");
  rootElement.appendChild(episodesContainer);

  //
  //
  //
  // Function to create the dropdown EPISODE select element
  function createDropdownEpisodeSelect() {
    var dropdownEpisodeSelect = document.createElement("select");
    dropdownEpisodeSelect.setAttribute("id", "dropdownEpisodeSelect");

    // Add options to the dropdown select
    var defaultOption = document.createElement("option");
    defaultOption.textContent = "All Episodes";
    dropdownEpisodeSelect.appendChild(defaultOption);

    // Loop through each episode and create an option for it
    allEpisodes.forEach(function (episode) {
      var option = document.createElement("option");
      option.textContent = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${episode.name}`;
      option.value = episode.id; // Assuming each episode has a unique ID
      dropdownEpisodeSelect.appendChild(option);
    });

    // Event listener for dropdown select change
    dropdownEpisodeSelect.addEventListener("change", function () {
      var selectedEpisodeId = dropdownEpisodeSelect.value;
      if (selectedEpisodeId === "" || selectedEpisodeId === "All Episodes") {
        displayEpisodes(allEpisodes);
      } else {
        var selectedEpisode = allEpisodes.find((episode) => episode.id === Number(selectedEpisodeId));
        displayEpisodes([selectedEpisode]);
      }
    });

    return dropdownEpisodeSelect;
  }

  // Create the dropdown select element
  var dropdownEpisodeSelect = createDropdownEpisodeSelect();
  topBar.appendChild(dropdownEpisodeSelect);

  //
  //
  //
  // Function to create the dropdown SHOW select element
  // Define createDropdownShowSelect as an async function
  async function createDropdownShowSelect() {
    // Fetch shows data

    const allShows = await fetchShows();

    var dropdownShowSelect = document.createElement("select");
    dropdownShowSelect.setAttribute("id", "dropdownShowSelect");

    // Add options to the dropdown select
    var defaultOption = document.createElement("option");
    defaultOption.textContent = "All Shows";
    dropdownShowSelect.appendChild(defaultOption);

    // Loop through each show and create an option for it
    allShows.forEach(function (show) {
      var option = document.createElement("option");
      option.textContent = `${show.name}`;
      option.value = show.id; // Assuming each show has a unique ID
      dropdownShowSelect.appendChild(option);
    });

    // Event listener for dropdown select change
    dropdownShowSelect.addEventListener("change", function () {
      var selectedShowId = dropdownShowSelect.value;

      console.log("selectedShowId ", selectedShowId);
      if (selectedShowId === "" || selectedEpisodeId === "All Shows") {
        displayEpisodes(allEpisodes);
      } else {
        var selectedShow = allShows.find((show) => show.id === Number(selectedShowId));
        displayEpisodes(selectedShow.episodes); // Pass the episodes array of the selected show
      }
    });

    return dropdownShowSelect;
  }

  // Create the dropdown select element
  createDropdownShowSelect().then(function (dropdownShowSelect) {
    topBar.appendChild(dropdownShowSelect);
  });

  ///////////////////////// BELOW IS FOOTER ///////////////////////
  ////////////////////////////////////////////////////////////////
  //
  //
  //
  // Function to create the footer
  function createFooter() {
    var footer = document.createElement("footer");

    // Create the first div element with the text "programmed by" and a link
    var div1 = document.createElement("div");
    var link = document.createElement("a");
    link.href = "https://github.com/ali-nasir-ali";
    link.textContent = "nasir";
    div1.textContent = "programmed by ";
    div1.appendChild(link);

    // Create the second div element with a link to the TV Maze API
    var div2 = document.createElement("div");
    var apiLink = document.createElement("a");
    apiLink.href = "https://www.tvmaze.com/api";
    apiLink.textContent = "TV Maze API";
    div2.appendChild(apiLink);

    // Append the div elements to the footer element
    footer.appendChild(div1);
    footer.appendChild(div2);

    // Append the footer element to the document body
    document.body.appendChild(footer);
  }
  // Create the footer
  createFooter();

  ///////////////////////// ABOVE IS FOOTER ///////////////////////
  ////////////////////////////////////////////////////////////////

  ////

  ////////////////// BELOW IS MAIN DISPLAY FUNCTION ///////////////
  ////////////////////////////////////////////////////////////////
  //
  //
  //
  // Function to display episodes
  function displayEpisodes(episodes) {
    // Filter episodes based on search input
    var searchTerm = searchBar.value.toLowerCase();
    var filteredEpisodes = episodes.filter(function (episode) {
      var episodeName = episode.name.toLowerCase();
      return episodeName.includes(searchTerm);
    });

    // Clear the previous episodes
    episodesContainer.innerHTML = "";

    // Create grid for episodes
    var grid = document.createElement("div");
    grid.setAttribute("class", "grid");
    episodesContainer.appendChild(grid);

    // Calculate the total number of episodes
    var totalEpisodes = filteredEpisodes.length;

    // Display 5 episodes across and 10 deep
    var episodesPerPage = 16; // 4 (across) * 4 (deep)
    var totalPages = Math.ceil(totalEpisodes / episodesPerPage);
    // Get the current page number
    var currentPage = 1;

    // Function to show episodes
    function showEpisodes(page) {
      // Clear the previous episodes
      grid.innerHTML = "";

      // Calculate the start and end indexes of episodes for the current page
      var startIndex = (page - 1) * episodesPerPage;
      var endIndex = startIndex + episodesPerPage;

      // Loop through the episodes and create elements for each
      for (var i = startIndex; i < endIndex && i < totalEpisodes; i++) {
        var episode = filteredEpisodes[i];

        // Create a container for each episode
        var episodeContainer = document.createElement("div");
        episodeContainer.setAttribute("class", "episode");

        // Create the episode season element
        var episodeSeason = document.createElement("h4");
        episodeSeason.textContent = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
        episodeContainer.appendChild(episodeSeason);

        // Create the episode name element
        var episodeName = document.createElement("h3");
        episodeName.textContent = episode.name;
        episodeContainer.appendChild(episodeName);

        // Create the episode description element
        var episodeDescription = document.createElement("p");
        episodeDescription.innerHTML = episode.summary;
        // Remove <p> tags from start and end
        episodeDescription.innerHTML = episodeDescription.innerHTML.replace(/^<p>/, "").replace(/<\/p>$/, "");
        episodeContainer.appendChild(episodeDescription);

        // Create the episode image element
        var episodeImage = document.createElement("img");
        episodeImage.setAttribute("src", episode.image.medium);
        episodeContainer.appendChild(episodeImage);

        // Append the episode container to the grid
        grid.appendChild(episodeContainer);
        generatePagination(totalEpisodes);
      }
    }

    // Show the first page of episodes initially
    showEpisodes(currentPage);
    generatePagination(totalPages);
  }

  //
  //
  //  displays Shows
  // Function to display shows
  function displayShows(shows) {
    // Filter shows based on search input
    var searchTerm = searchBar.value.toLowerCase();
    var filteredShows = shows.filter(function (show) {
      var showName = show.name.toLowerCase();
      return showName.includes(searchTerm);
    });

    // Clear the previous shows
    episodesContainer.innerHTML = "";

    // Create grid for shows
    var grid = document.createElement("div");
    grid.setAttribute("class", "grid");
    episodesContainer.appendChild(grid);

    // Loop through the shows and create elements for each
    filteredShows.forEach(function (show) {
      // Create a container for each show
      var showContainer = document.createElement("div");
      showContainer.setAttribute("class", "show");

      // Create the show name element
      var showName = document.createElement("h3");
      showName.textContent = show.name;
      showContainer.appendChild(showName);

      // Create the show image element
      var showImage = document.createElement("img");
      showImage.setAttribute("src", show.image.medium);
      showContainer.appendChild(showImage);

      // Append the show container to the grid
      grid.appendChild(showContainer);
    });

    generatePagination(filteredShows.length);
  }

  //
  //
  //  pagination
  function generatePagination(totalPages) {
    // Clear the previous pagination links
    var pagination = document.querySelector(".pagination");
    if (pagination) {
      pagination.parentNode.removeChild(pagination);
    }

    // Create pagination links
    pagination = document.createElement("div");
    pagination.setAttribute("class", "pagination");
    episodesContainer.appendChild(pagination);

    // Function to handle pagination click
    function handlePaginationClick(page) {
      currentPage = page;
      showEpisodes(currentPage);
    }

    // Generate pagination links
    for (var page = 1; page <= totalPages; page++) {
      var pageLink = document.createElement("a");
      pageLink.textContent = page;
      pageLink.setAttribute("href", "#");
      pageLink.addEventListener(
        "click",
        (function (page) {
          return function (event) {
            event.preventDefault();
            handlePaginationClick(page);
          };
        })(page)
      );

      pagination.appendChild(pageLink);
    }
  }

  ////////////////// ABOVE IS MAIN DISPLAY FUNCTION ///////////////
  ////////////////////////////////////////////////////////////////

  // Event listener for search bar input for EPISODES
  searchBar.addEventListener("input", function () {
    displayEpisodes(allEpisodes);
  });

  // Event listener for search bar input for SHOWS
  searchBar.addEventListener("input", function () {
    displayShows(allShows);
  });

  // // Event listener for search bar input for SHOWS
  // searchBar.addEventListener("input", function () {
  //   displayShows(allShows);
  // });

  // Fetch shows and display them
  fetchShows()
    .then(function (shows) {
      displayShows(shows);
    })
    .catch(function (error) {
      console.error("Error fetching shows:", error);
    });

  // Display all episodes initially
  // displayEpisodes(allEpisodes);
});
