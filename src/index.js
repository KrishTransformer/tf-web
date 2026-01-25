import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ErrorBoundary } from 'react-error-boundary'

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert" className="container mt-5 text-danger">
    <h4>Something went wrong:</h4>
    <pre>{error.message}</pre>
    <button className="btn btn-primary mt-3" onClick={resetErrorBoundary}>
      Try Again
    </button>
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
    </ErrorBoundary>
  </Provider>
);
