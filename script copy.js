document.addEventListener("DOMContentLoaded", function () {
  // Get the root element
  var rootElement = document.getElementById("root");

  const navigation = document.createElement("div");
  navigation.setAttribute("id", "navigation");

  rootElement.prepend(navigation);

  //------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                                          BELOW IS Fetching Data
  //___________________________________________________________________________________________________________________________________________

  let allShows = [];
  let currentEpisodes = [];

  const fetchShowsAndEpisodes = async (link) => {
    try {
      const response = await fetch(`https://api.tvmaze.com/${link}`);
      const shows = await response.json();
      return shows;
    } catch (error) {
      console.error("Error fetching shows:", error);
      return [];
    }
  };

  const sortShowsByName = async () => {
    try {
      const fetchedShows = await fetchShowsAndEpisodes("shows");
      const sortedShows = fetchedShows.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
      allShows = sortedShows;
      return sortedShows;
    } catch (error) {
      console.error("Error sorting shows:", error);
    }
  };

  const fetchEpisodes = async (selectedShowId) => {
    try {
      const episodes = await fetchShowsAndEpisodes(`shows/${selectedShowId}/episodes`);
      currentEpisodes = episodes;
      return episodes;
    } catch (error) {
      console.error("Error fetching episodes:", error);
      return [];
    }
  };

  //------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                                          ABOVE IS Fetching Data
  //___________________________________________________________________________________________________________________________________________

  //------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                                              BELOW IS NAV
  //___________________________________________________________________________________________________________________________________________

  // search for shows
  const createSearchInput = () => {
    const searchInput = document.createElement("input");
    searchInput.id = "searchInputShows";
    searchInput.type = "text";
    searchInput.placeholder = "Search Shows...";

    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value;
      const filteredShows = searchShows(searchTerm, allShows);
      createShowDiv(filteredShows);
    });

    return searchInput;
  };
  // search for episodes
  const searchBarEpisodes = () => {
    const searchInput = document.createElement("input");
    searchInput.id = "searchInputEpisodes";
    searchInput.type = "text";
    searchInput.placeholder = "Search Episode...";

    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value;
      const filteredShows = searchEpisode(searchTerm, currentEpisodes);
      createEpisodesDiv(filteredShows);
    });

    return searchInput;
  };
  // dropdown menu for shows
  const createShowSelect = (shows) => {
    const showSelect = document.createElement("select");
    showSelect.id = "show-select";
    showSelect.innerHTML = `<option value="">Select a show</option>`;
    shows.forEach((show) => {
      showSelect.innerHTML += `<option value="${show.id}">${show.name}</option>`;
    });

    showSelect.addEventListener("change", async (event) => {
      const selectedShowId = parseInt(event.target.value);
      if (selectedShowId) {
        const episodes = await fetchEpisodes(selectedShowId);
        createEpisodesDiv(episodes);
      } else {
        createShowDiv(allShows);
      }
    });

    return showSelect;
  };
  // function formatSeriesNumber(number) {
  //   return number < 10 ? "0" + number : number;
  // }
  //
  function createEpisodeSelect(allEpisodes) {
    const showSelect = document.createElement("select");
    showSelect.id = "episode-select";
    showSelect.innerHTML = `<option value="">Select a show</option>`;
    allEpisodes.forEach((show) => {
      console.log(`${show.id}`);
      showSelect.innerHTML += `<option value="${show.id}">${show.name}</option>`;
    });
    showSelect.addEventListener("change", async (event) => {
      const selectedShowId = parseInt(event.target.value);
      if (selectedShowId) {
        const episodes = await fetchEpisodes(selectedShowId);
        createEpisodesDiv(episodes);
      } else {
        createShowDiv(allShows);
      }
    });
    const navigation = document.getElementById("navigation");
    navigation.appendChild(showSelect);
  }

  // const createEpisodeSelect = (episodes) => {
  //   const episodeSelect = document.createElement("select");
  //   episodeSelect.id = "episode-select";
  //   //
  //   //
  //   episodeSelect.innerHTML = `<option value="">Select an Episode</option>`;
  //   episodes.forEach((episode) => {
  //     const option = document.createElement("option");
  //     const episodeNumber = `S${formatSeriesNumber(episode.season)}E${formatSeriesNumber(episode.number)}`;
  //     option.value = episodeNumber;
  //     option.textContent = `${episode.name} - ${episodeNumber}`;
  //     episodeSelect.appendChild(option);
  //   });
  //   // episodes.forEach((episode) => {
  //   //   let option = document.createElement("option");
  //   //   console.log(`S${formatSeriesNumber(episode.season)}E${formatSeriesNumber(episode.number)}`);
  //   //   option.setAttribute("value", `S${formatSeriesNumber(episode.season)}E${formatSeriesNumber(episode.number)}`);
  //   //   option.innerHTML = `${episode.name} - S${formatSeriesNumber(episode.season)}E${formatSeriesNumber(episode.number)}`;
  //   //   episodeSelect.append(option);
  //   // });
  //   //
  //   //

  // back button to go back to all shows
  function createBackButton() {
    const resetButton = document.createElement("button");
    resetButton.id = "resetSelectionButton";
    resetButton.textContent = "All Shows";
    resetButton.addEventListener("click", () => {
      createShowDiv(allShows);
    });
    return resetButton;
  }
  // putting all the navigation elements to the root element
  const createNavigation = () => {
    //   const navigation = document.createElement("div");
    //   navigation.setAttribute("id", "navigation");

    const searchInputShows = createSearchInput(); // search input for shows
    const searchInputEpisodes = searchBarEpisodes(); // search input for episodes
    const showSelect = createShowSelect(allShows); // dropdown menu for shows
    createEpisodeSelect(currentEpisodes); // dropdown menu for Episodes
    const backSelect = createBackButton(); // back button to go back to all shows

    navigation.appendChild(searchInputShows);
    navigation.appendChild(searchInputEpisodes);
    navigation.appendChild(backSelect);
    navigation.appendChild(showSelect);

    // navigation.appendChild(episodeSelect);

    return navigation;
  };
  createNavigation();
  //------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                                              ABOVE IS NAV
  //___________________________________________________________________________________________________________________________________________

  //------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                                          BELOW IS FOOTER
  //___________________________________________________________________________________________________________________________________________

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

  //------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                                          ABOVE IS FOOTER
  //___________________________________________________________________________________________________________________________________________

  //------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                                          BELOW IS EXTRA UTILITIES
  //___________________________________________________________________________________________________________________________________________

  // Create pagination Element
  const ITEMS_PER_PAGE = 20;

  function shortenText(text, lengthCap) {
    if (text.length > lengthCap) {
      return text.slice(0, lengthCap) + "...";
    } else {
      return text;
    }
  }

  //------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                                          BELOW IS Displaying Shows
  //___________________________________________________________________________________________________________________________________________

  const createShowDiv = (shows) => {
    // if there are any episodes cards they would be removed
    const episodesListing = document.getElementById("episodeslisting");
    if (episodesListing) {
      episodesListing.innerHTML = "";
      // remove the back button
      rootElement.classList.remove("showResetButton");
      // remove the old pagination
      const paginationElement = document.getElementById("pagination");
      paginationElement.remove();
      // remove episode search bar
      document.getElementById("searchInputEpisodes").style.display = "none";
      // display shows search bar
      document.getElementById("searchInputShows").style.display = "block";
    }

    //
    //
    // Get the current page number
    var currentPage = 1;
    function showEpisodes(page) {
      const showsListing = document.getElementById("showslisting");
      if (!showsListing) {
        const newShowsListing = document.createElement("div");
        newShowsListing.id = "showslisting";
        rootElement.appendChild(newShowsListing);
      } else {
        showsListing.innerHTML = "";
      }

      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedShows = shows.slice(startIndex, endIndex);

      paginatedShows.forEach((show) => {
        let imageCard = "";
        try {
          imageCard = show.image.medium;
        } catch (err) {
          imageCard = "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
        }

        showSummary = shortenText(show.summary, 200);

        const showCard = document.createElement("div");
        showCard.className = "show-card";
        showCard.innerHTML = `
        <h2>${show.name}</h2 >
        <img src="${imageCard}" alt="${show.name}">
        <p>${showSummary}</p>
       
        <p>Status: ${show.status}</p>
        <p>Rating: ${show.rating.average}</p>
        <p>Runtime: ${show.runtime} minutes</p>
      `;

        showCard.addEventListener("click", async () => {
          const episodes = await fetchEpisodes(show.id);
          createEpisodesDiv(episodes);
        });

        document.getElementById("showslisting").appendChild(showCard);
      });
    }

    // Show the first page of episodes initially
    showEpisodes(currentPage);

    const totalPages = Math.ceil(shows.length / ITEMS_PER_PAGE);

    // Create pagination links
    var pagination = document.createElement("div");
    pagination.id = "pagination";
    rootElement.appendChild(pagination);

    // Generate pagination links
    for (var pageNum = 1; pageNum <= totalPages; pageNum++) {
      var pageLink = document.createElement("a");
      pageLink.textContent = pageNum;
      pageLink.setAttribute("href", "#");

      pageLink.addEventListener(
        "click",
        (function (pageNum) {
          return function (event) {
            event.preventDefault();
            showEpisodes(pageNum);
          };
        })(pageNum)
      );
      // display shows search bar
      // document.getElementById("pagination").style.color = "magenta";
      pagination.appendChild(pageLink);
    }
    // showSelect.value = "";
  };

  //------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                                          ABOVE IS Displaying Shows
  //___________________________________________________________________________________________________________________________________________

  //------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                                          BELOW IS Displaying Episodes
  //___________________________________________________________________________________________________________________________________________

  const createEpisodesDiv = (episodes) => {
    createEpisodeSelect(currentEpisodes);
    try {
      // clear all the old display elements
      showslisting.innerHTML = "";
      // reset button is added
      rootElement.classList.add("showResetButton");
      // add episode search bar
      document.getElementById("searchInputEpisodes").style.display = "block";
      // if there are any episodes cards they would be removed
      const showsSearchBar = document.getElementById("searchInputShows");
      if (showsSearchBar) {
        // remove episode search bar
        document.getElementById("searchInputShows").style.display = "none";
      }

      // remove the old pagination
      const paginationElement = document.getElementById("pagination");
      paginationElement.remove();

      // if there are any shows cards they would be removed
      const ifEpisodesListingExist = document.getElementById("episodeslisting");
      if (ifEpisodesListingExist) {
        episodeslisting.innerHTML = "";
      }
    } catch (err) {
      console.log(err);
    }
    //
    //
    // Get the current page number
    var currentPage = 1;
    function showEpisodes(page) {
      const episodesListing = document.getElementById("episodeslisting");
      if (!episodesListing) {
        const newEpisodesListing = document.createElement("div");
        newEpisodesListing.id = "episodeslisting";
        rootElement.appendChild(newEpisodesListing);
      } else {
        episodesListing.innerHTML = "";
      }

      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedEpisodes = episodes.slice(startIndex, endIndex);

      paginatedEpisodes.forEach((episode) => {
        let imageCard = "";
        try {
          imageCard = episode.image.medium;
        } catch (err) {
          imageCard = "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
        }
        elemSummary = shortenText(episode.summary, 200);

        const episodeCard = document.createElement("div");
        episodeCard.className = "episode-card";
        episodeCard.innerHTML = `      
        <h3>${episode.name}</h3>
        <p>S${episode.season.toString().padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}</p>
        <img src="${imageCard}" alt="${episode.name}">
        <p>${elemSummary}</p> 
        <p>Airdate: ${episode.airdate}</p>
      `;

        document.getElementById("episodeslisting").appendChild(episodeCard);
      });
    }

    // Show the first page of episodes initially
    showEpisodes(currentPage);

    const totalPages = Math.ceil(episodes.length / ITEMS_PER_PAGE);

    // Create pagination links
    var pagination = document.createElement("div");
    pagination.id = "pagination";
    rootElement.appendChild(pagination);

    // Generate pagination links
    for (var pageNum = 1; pageNum <= totalPages; pageNum++) {
      var pageLink = document.createElement("a");
      pageLink.textContent = pageNum;
      pageLink.setAttribute("href", "#");
      pageLink.addEventListener(
        "click",
        (function (pageNum) {
          return function (event) {
            event.preventDefault();
            showEpisodes(pageNum);
          };
        })(pageNum)
      );
      // display shows search bar
      // document.getElementById("pagination").style.color = "magenta";
      pagination.appendChild(pageLink);
    }
  };

  //------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                                          ABOVE IS Displaying Episodes
  //___________________________________________________________________________________________________________________________________________

  //------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                                          BELOW IS Utility Functions
  //___________________________________________________________________________________________________________________________________________

  // searching for shows
  const searchShows = (searchTerm, shows) => {
    if (!searchTerm) {
      return shows;
    }

    searchTerm = searchTerm.toLowerCase();
    return shows.filter((show) => show.name.toLowerCase().includes(searchTerm));
  };
  // searching for episodes
  const searchEpisode = (searchTerm, episodes) => {
    if (!searchTerm) {
      return episodes;
    }

    searchTerm = searchTerm.toLowerCase();
    return episodes.filter((show) => show.name.toLowerCase().includes(searchTerm));
  };

  //------------------------------------------------------------------------------------------------------------------------------------------
  //                                                                                                          BELOW IS Executing Fetch
  //___________________________________________________________________________________________________________________________________________

  const executeFetch = async () => {
    try {
      allShows = await sortShowsByName();
      createShowDiv(allShows);
    } catch (error) {
      console.error("Error executing fetch:", error);
    }
  };
  executeFetch();
});
