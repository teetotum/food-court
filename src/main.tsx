import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, Route, BrowserRouter as Router, Routes, useParams } from 'react-router-dom';
import { Meals } from './Meals.tsx';
import { Suggestions } from './Suggestions.tsx';
import { DevDashboard } from './DevDashboard.tsx';
import './index.scss';
import style from './main.module.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <div className={style.main}>
        <h1>Food Court</h1>
        <Suggestions />
      </div>

      <Meals />
      <DevDashboard />
    </Router>
  </React.StrictMode>
);
