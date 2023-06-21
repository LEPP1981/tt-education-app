import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchMovies = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [year, setYear] = useState('');
  const [results, setResults] = useState([]);

  const [movies, setMovies] = useState([]);
  const [expandedMovieId, setExpandedMovieId] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: {
            api_key: 'a6c3b3938c76f38f3289b3291fd0629f',
          },
        });

        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    
    fetchGenres();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: 'a6c3b3938c76f38f3289b3291fd0629f',
          with_genres: selectedGenre,
          year: year,
        },
      });

      setResults(response.data.results);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  const toggleExpand = movieId => {
    if (expandedMovieId === movieId) {
      setExpandedMovieId(null);
    } else {
      setExpandedMovieId(movieId);
    }
  };

  const renderOverviewText = (overview, movieId) => {
    if (overview.length <= 200 || expandedMovieId === movieId) {
      return overview;
    }

    return overview.slice(0, 200) + '...';
  };



  return (
    <div className="recent-movies-container">

    <div className="search-intro-container">
      <div className="search-form">
        <div className="genre-select-container">
            <label htmlFor="genre">Genre:</label>
            <select id="genre" value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}>
            <option value="">Select a genre</option>
            {genres.map(genre => (
                <option key={genre.id} value={genre.id}>
                {genre.name}
                </option>
            ))}
            </select>
        </div>
        <div className="year-field-container">
            <label htmlFor="year">Year:</label>
            <input type="text" id="year" value={year} onChange={e => setYear(e.target.value)} />
        </div>
        <button id="search" onClick={handleSearch}>Search</button>
      </div>

      <div className="intro">
         <h3>Welcome to TrendFlix</h3>
         <p>We are committed to inform you of the latest and hottest films and TV Shows. Use the search tool to look for the trendiest shows and films by genre and year or simply browse or selection of the latest TV shows below!</p>
      </div>
      </div>

      {results.length > 0 && (
            <div className="search-grid">
            {results.map(result => (
                <div key={result.id} className="movie-card">
                <h3>{result.title}</h3>
                <img
                    src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                    alt={result.title}
                    className="movie-poster"
                />
                <p className="rating-box">Rating: {result.vote_average}</p>
                </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default SearchMovies;