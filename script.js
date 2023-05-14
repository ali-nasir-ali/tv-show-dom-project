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
  // Create a container for the episodes
  var episodesContainer = document.createElement("div");
  episodesContainer.setAttribute("id", "episodesContainer");
  rootElement.appendChild(episodesContainer);

  //
  //
  //
  // Get all episodes from the episodes.js file
  var allEpisodes = getAllEpisodes();

  //
  //
  //
  // Function to create the dropdown select element

  function createDropdownSelect() {
    var dropdownSelect = document.createElement("select");
    dropdownSelect.setAttribute("id", "dropdownSelect");

    // Add options to the dropdown select
    var defaultOption = document.createElement("option");
    defaultOption.textContent = "All Episodes";
    dropdownSelect.appendChild(defaultOption);

    // Loop through each episode and create an option for it
    allEpisodes.forEach(function (episode) {
      var option = document.createElement("option");
      option.textContent = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")} - ${episode.name}`;
      option.value = episode.id; // Assuming each episode has a unique ID
      dropdownSelect.appendChild(option);
    });

    // Event listener for dropdown select change
    dropdownSelect.addEventListener("change", function () {
      var selectedEpisodeId = dropdownSelect.value;
      if (selectedEpisodeId === "all") {
        displayEpisodes(allEpisodes);
      } else {
        var selectedEpisode = allEpisodes.find(function (episode) {
          return episode.id === selectedEpisodeId;
        });
        displayEpisodes([selectedEpisode]);
      }
    });

    return dropdownSelect;
  }

  // Create the dropdown select element
  var dropdownSelect = createDropdownSelect();
  topBar.appendChild(dropdownSelect);

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

  //

  ////////////////// BELOW IS MAIN DISPLAY FUNCTION ///////////////
  ////////////////////////////////////////////////////////////////
  //
  //
  //
  // Function to display episodes
  function displayEpisodes(episodes) {
    // Clear the previous episodes
    episodesContainer.innerHTML = "";

    //
    //
    // Filter episodes based on search input
    var searchTerm = searchBar.value.toLowerCase();
    var filteredEpisodes = episodes.filter(function (episode) {
      var episodeName = episode.name.toLowerCase();
      return episodeName.includes(searchTerm);
    });

    // Create grid for episodes
    var grid = document.createElement("div");
    grid.setAttribute("class", "grid");
    episodesContainer.appendChild(grid);

    // Calculate the total number of episodes
    var totalEpisodes = filteredEpisodes.length;

    // Display 5 episodes across and 10 deep
    var episodesPerPage = 16; // 3 (across) * 5 (deep)
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
        var episodeName = document.createElement("h4");
        episodeName.textContent = `S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;
        episodeContainer.appendChild(episodeName);

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
      }
    }

    // Show the first page of episodes initially
    showEpisodes(currentPage);

    // Create pagination links
    var pagination = document.createElement("div");
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

  // Event listener for search bar input
  searchBar.addEventListener("input", function () {
    displayEpisodes(allEpisodes);
  });

  // Display all episodes initially
  displayEpisodes(allEpisodes);
});
