import React from "react";
import { Container } from "react-bootstrap";

const Result = ({ results, loading }) => {
  return (
    <React.Fragment>
      <Container>
        {loading ? (
          <h1>Loading......</h1>
        ) : (
          <React.Fragment>
            <h2 className="text-center p-3">Report</h2>
            <div className="text-center">
              {results.count.plagiarised > 0 ? (
                <p className="text-danger">
                  {results.count.plagiarised} out of {results.count.total} found
                  plagiarised
                </p>
              ) : (
                <p className="text-success">
                  {results.count.plagiarised} out of {results.count.total} found
                  plagiarised
                </p>
              )}
            </div>
            {results.result.map((data, index) => (
              <a href={data.url} target="_blank" rel="noreferrer">
                <p>{data.text}</p>
              </a>
            ))}
          </React.Fragment>
        )}
      </Container>
    </React.Fragment>
  );
};

export default Result;
