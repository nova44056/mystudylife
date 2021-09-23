import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Guest } from "./pages/Guest";
import { Dashboard } from "./pages/Dashboard";
import { SignUp } from "./pages/SignUp";
import { Schedule } from "./pages/Schedule";
import css from "./App.module.css";
import {
  AiFillDashboard,
  AiFillCalendar,
  AiFillCheckSquare,
  AiFillSnippets,
  AiFillSchedule,
  AiOutlineFileSearch,
} from "react-icons/ai";
import { Sidebar } from "./components/sidebar";
import { Playground } from "./pages/Playground";
import { PrivateRoute, PublicRoute } from "./routes";
import { useMeQuery } from "./generated/graphql";
import { PageLoader } from "./components/loading";

function App() {
  const { data, loading, error } = useMeQuery();

  if (error) console.log(error);

  if (loading) return <PageLoader />;

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <PublicRoute data={data} exact path="/" component={Guest} />
          <PublicRoute data={data} path="/sign-up" component={SignUp} />
          <React.Fragment>
            <div className={css.page}>
              <Sidebar
                menu={[
                  { icon: <AiFillDashboard />, pathname: "dashboard" },
                  { icon: <AiFillCalendar />, pathname: "calendar" },
                  { icon: <AiFillCheckSquare />, pathname: "task" },
                  { icon: <AiFillSnippets />, pathname: "exam" },
                  { icon: <AiFillSchedule />, pathname: "schedule" },
                  { icon: <AiOutlineFileSearch />, pathname: "search" },
                ]}
              />
              <PrivateRoute
                data={data}
                path="/dashboard"
                component={Dashboard}
              />
              <PrivateRoute data={data} path="/schedule" component={Schedule} />
              <PrivateRoute
                data={data}
                path="/playground"
                component={Playground}
              />
            </div>
          </React.Fragment>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
