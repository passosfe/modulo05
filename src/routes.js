import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Main from "./Main/index";
import Repository from "./Repository/index";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/repository/:repository" component={Repository} />
      </Switch>
    </BrowserRouter>
  );
}
