import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './tmdb.css';

const RecentMovies = () => {
  const [movies, setMovies] = useState([]);
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/trending/tv/week', {
          params: {
            api_key: 'a6c3b3938c76f38f3289b3291fd0629f',
          },
        });

        const moviesWithReviews = await Promise.all(
          response.data.results.map(async movie => {
            const reviewsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${movie.id}/reviews`, {
              params: {
                api_key: 'a6c3b3938c76f38f3289b3291fd0629f',
              },
            });

            const reviews = reviewsResponse.data.results.slice(0, 3).map(review => review.content);

            return {
              ...movie,
              reviews,
            };
          })
        );

        setMovies(moviesWithReviews);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
      }
    };

    fetchMovies();
  }, []);

  const toggleExpand = movieId => {
    if (expandedMovieId === movieId) {
      setExpandedMovieId(null);
    } else {
      setExpandedMovieId(movieId);
    }
  };

  const toggleReviews = movieId => {
    if (expandedReviews.includes(movieId)) {
      setExpandedReviews(expandedReviews.filter(id => id !== movieId));
    } else {
      setExpandedReviews([...expandedReviews, movieId]);
    }
  };

  const renderOverviewText = (overview, movieId) => {
    if (overview.length <= 200 || expandedMovieId === movieId) {
      return overview;
    }

    return overview.slice(0, 200) + '...';
  };

  return (
    <div className="recent-movies-container" id="homepage-movies">
      <h2>Recent TV Shows</h2>
      <div className="movies-grid">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <h3>{movie.name}</h3>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.name}
              className="movie-poster"
            />
            <p className="rating-box">Rating: {movie.vote_average}</p>
            
            <div className="reviews">
              <h4 onClick={() => toggleReviews(movie.id)}>
                {movie.reviews.length} Reviews
              </h4>
              {expandedReviews.includes(movie.id) && (
                <ul className="reviews-list">
                  {movie.reviews.map((review, index) => (
                    <li key={index}>{review}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentMovies;