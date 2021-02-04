import React, {
  useState,
  useEffect,
} from "react";
import axios from "axios";

const Search = () => {
  const [term, setTerm] = useState("programming");
  const [
    debouncedTerm,
    setDebouncedTerm,
  ] = useState(term);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      //When term updates we set timer to update debouncedTerm to term
      setDebouncedTerm(term);
    }, 1000);

    //return a cleanup function, when user types we cancel previous timer and set new timer
    return () => {
      clearTimeout(timerId);
    };
  }, [term]);

  useEffect(() => {
    //Make request and search for the term 'debouncedTerm'
    const search = async () => {
      const { data } = await axios.get(
        "https://en.wikipedia.org/w/api.php",
        {
          params: {
            action: "query",
            list: "search",
            origin: "*",
            format: "json",
            srsearch: debouncedTerm,
          },
        }
      );
      //Drill down to return the results we want
      setResults(data.query.search);
    };
    search();
  }, [debouncedTerm]);

  const renderedResults = results.map(
    (result) => {
      return (
        <div className="item" key={result.pageid}>
          <div className="right floated content">
            <a
              className="ui button"
              href={`https://en.wikipedia.org?curid=${result.pageid}`}
            >
              Go
            </a>
          </div>
          <div className="content">
            <div className="header">
              {result.title}
            </div>
            <span
              dangerouslySetInnerHTML={{
                __html: result.snippet,
              }}
            ></span>
          </div>
        </div>
      );
    }
  );

  return (
    <div>
      <div className="ui form">
        <div className="field">
          <label>Enter Search Term</label>
          <input
            value={term}
            onChange={(e) =>
              setTerm(e.target.value)
            }
            className="input"
          />
        </div>
      </div>
      <div className="ui celled list">
        {renderedResults}
      </div>
    </div>
  );
};

export default Search;
