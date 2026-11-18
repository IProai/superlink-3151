import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import Index from "./pages/index";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

// Secondary routes are split out of the homepage bundle.
const Shop = lazy(() => import("./pages/shop"));
const QuickOrder = lazy(() => import("./pages/quick-order"));
const Rfq = lazy(() => import("./pages/rfq"));

function App() {
  return (
    <Provider>
      <Suspense fallback={<div className="min-h-screen" />}>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/shop" component={Shop} />
        <Route path="/quick-order" component={QuickOrder} />
        <Route path="/rfq" component={Rfq} />
        <Route component={Index} />
      </Switch>
      </Suspense>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
