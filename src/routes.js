import React from 'react';
import Loadable from 'react-loadable'

// import CodeEditors from './views/Editors/CodeEditors'
import DefaultLayout from './containers/DefaultLayout';

function Loading() {
  return <div>Loading...</div>;
}

const GeneralTrend = Loadable({
  loader: () => import('./views/GeneralTrend'),
  loading: Loading,
});

const GeneralInfo = Loadable({
  loader: () => import('./views/GeneralInfo'),
  loading: Loading,
});

const HashtagTrend = Loadable({
  loader: () => import('./views/HashtagTrend'),
  loading: Loading,
});
const HateSpeaker = Loadable({
  loader: () => import('./views/HateSpeaker'),
  loading: Loading,
});

const CounterNarratives = Loadable({
  loader: () => import('./views/CounterNarratives'),
  loading: Loading,
});

const Alerts = Loadable({
  loader: () => import('./views/Alerts'),
  loading: Loading,
});



// issue with mispalced position of cm value for acync load
// const CodeEditors = Loadable({
//   loader: () => import('./views/Editors/CodeEditors'),
//   loading: Loading,
// });


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', name: 'Home', component: DefaultLayout, exact: true },
  { path: '/generalTrends', name: 'Recent trends', component: GeneralTrend },
  { path: '/generalInfo', name: 'HateMeter Platform', component: GeneralInfo },
  { path: '/hashtagTrends', name: 'Hashtag Trends', component: HashtagTrend },
  { path: '/hateSpeakers', name: 'Hate Speakers', component: HateSpeaker },
  { path: '/counterNarratives', name: 'Counter-narratives', component: CounterNarratives },
  { path: '/alerts', name: 'Alerts', component: Alerts }

];

export default routes;
