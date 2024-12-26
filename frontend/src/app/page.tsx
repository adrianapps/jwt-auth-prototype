"use client";

import Movie from "@/types/Movie";
import { useEffect, useState } from "react";
import api from "./api";
import withProtectedRoute from "@/components/withProtectedRoute";
import { REFRESH_TOKEN } from "./constants";
import { useRouter } from "next/navigation";

function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/api/movies/")
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.error("API Error:", err);
      });
  }, []);

  const onLogout = () => {
    const refresh_token = localStorage.getItem(REFRESH_TOKEN);

    if (!refresh_token) {
      console.error("No refresh token found.");
      return;
    }

    api
      .post("/api/logout/", { refresh_token })
      .then((res) => {
        console.log("Logout successful:", res.data);
        localStorage.clear();
        router.push("/login");
      })
      .catch((err) => {
        console.error("Logout Error:", err);
      });
  };

  return (
    <div className="relative">
      <button
        onClick={onLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Logout
      </button>
      <h1 className="font-bold">Movies List:</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default withProtectedRoute(Home);
