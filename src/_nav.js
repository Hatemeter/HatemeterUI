export default {
  items: [
    {
      title: true,
      name: 'Data Analysis',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Recent trends',
      url: '/generalTrends',
      icon: 'fa fa-line-chart',
    },
    {
      name: 'Hashtag trends',
      url: '/hashtagTrends',
      icon: 'fa fa-hashtag',
    },
    {
      name: 'Hate speakers',
      url: '/hateSpeakers',
      icon: 'fa fa-address-book',
    },

    {
      title: true,
      name: 'COMPUTER ASSISTED PERSUASION',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Counter-narratives',
      icon: 'icon-pencil',
      url: '/counterNarratives',
      // attributes: { disabled: true },
      // badge: {
      //   variant: 'info',
      //   text: 'June 2019',
      // },
    },
    {
      name: 'Alerts',
      icon: 'icon-flag',
      url: '/alerts'
    },
    // {
    //   name: 'Hints',
    //   icon: 'icon-bulb',
    //   attributes: { disabled: true },
    //   badge: {
    //     variant: 'info',
    //     text: 'June 2019',
    //   },
    // },

    {
      title: true,
      name: 'PROJECT HATEMETER',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    }
    ,
    {
      name: 'Hatemeter Platform',
      icon: 'icon-info',
      url: '/generalInfo'
    }
  ]
};
