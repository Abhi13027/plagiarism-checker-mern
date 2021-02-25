import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Result from "./pages/Result";
import Appbar from "./components/Appbar";

function App() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  return (
    <Router>
      <Appbar></Appbar>
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <Home
              setLoading={setLoading}
              results={results}
              setResults={setResults}
            ></Home>
          )}
        ></Route>
        <Route
          path="/result"
          render={() => <Result results={results} loading={loading}></Result>}
        ></Route>
      </Switch>
    </Router>
  );
}

export default App;
