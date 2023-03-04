import { use } from "react";
import { useSelector } from "react-redux";
import { fetchActors } from "../api/tmdbApis";

export default function SearchActors() {
  const currGeneres = useSelector((state) => state?.movieQuery?.genres);
  const data = use(fetchActors());

  console.log("data", data);

  return <div>SearchActors</div>;
}
