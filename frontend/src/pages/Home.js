import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import axios from "../config";
import { useHistory } from "react-router-dom";
const Home = ({ results, setResults, setLoading }) => {
  const [query, setQuery] = useState("");
  let history = useHistory();

  const submitHandler = async (e) => {
    history.push("/result");
    const response = await axios.post("/results", { query: query });
    console.log(response);
    setResults(response.data);
    setLoading(false);
  };

  return (
    <React.Fragment>
      <Container>
        <h2 align="center" className="p-4">
          Enter the Code below that needs to be checked
        </h2>
        <div className="form-group green-border-focus">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
            className="form-control"
            id="exampleFormControlTextarea5"
            rows="12"
            style={{ resize: "none" }}
          ></textarea>
        </div>
        <div className="text-center">
          <Button variant="primary" onClick={submitHandler}>
            SUBMIT
          </Button>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Home;
