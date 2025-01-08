//Clock
let clockInterval;
let seconds = 0;
let isClockRunning = false;

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function startClock() {
  if (!isClockRunning) {
    clockInterval = setInterval(() => {
      seconds++;
      document.getElementById('clock').textContent = "Task Duration: " + formatTime(seconds);
    }, 1000);
    isClockRunning = true;
  }
}

function stopClock() {
  clearInterval(clockInterval);
  isClockRunning = false;
}
// hold the objects that will be created after domcontentloaded
let mapview = null


document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('resumeButton').addEventListener('click', function () {
    var resumeMask = document.getElementById('resumeMask');
    var resumeButton = document.getElementById('resumeButton');
    resumeButton.style.display = 'none';


    // Hide outer1
    var inner1 = document.getElementById('inner1');
    inner1.classList.add('slide-out-left');
    setTimeout(function () {
      toggleDrawer();
      resumeMask.classList.add('fade-out');
      inner1.classList.remove('slide-out-left');
      resumeMask.style.display = 'none';
      resumeMask.classList.remove('fade-out');
      resumeButton.style.display = 'flex';
    }, 500);

  });
});


function toggleDrawer() {
  {
    let el = document.getElementById('outer1');
    el.classList.toggle('is-hidden');
    let text = el.classList.contains('is-hidden') ? 'Show Task' : 'Hide Task';
    document.getElementById('toggle-button').classList.toggle('is-hidden');

    if (el.classList.contains('is-hidden')) {
      startClock(); 
    } else {
      stopClock(); 
      if (document.getElementById('clock').textContent !== 'Task Duration: 00:00:00') {

        document.getElementById('resumeMask').style.display = 'flex'
      }; 
    }
  }

  {
    let el = document.getElementById('outer2');
    el.classList.toggle('has-sidebar');
    el.classList.toggle('full-width');
  }

  // Apparently the browser does not always resize the canvas
  // Hence, we need to manually call resize on the mapview
  // resize()
}

function getParticipantId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

function urlWithId(url) {
  return url + "?id=" + getParticipantId();
}

function subscribeScale(map) {
  let msgbus = new varioscale.MessageBusConnector();
  msgbus.subscribe('map.scale', (topic, message, sender) => {
    if (mapview === null || sender !== mapview.msgbus.id) return;
    const scale = (Math.round(message[1] / 1) * 1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "")
    const xy = message[0]
    let el = document.getElementById("scale-denominator-placeholder");
    el.textContent = "Scale: 1:" + scale;
  });
}


function subscribeCoordinates(map) {
  let msgbus = new varioscale.MessageBusConnector();
  msgbus.subscribe('map.scale', (topic, message, sender) => {
    if (mapview === null || sender !== mapview.msgbus.id) return;
    const scale = (Math.round(message[1] / 1) * 1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "")
    const xy = message[0]
    let el = document.getElementById("coordinates-placeholder");
    el.textContent = "x: " + xy[0].toFixed(0) + "m" + ", " + "y: " + xy[1].toFixed(0) + "m";
  });
}



function subscribeStep(map) {
  let msgbus = new varioscale.MessageBusConnector();
  msgbus.subscribe('map.step', (topic, message, sender) => {
    if (mapview === null || sender !== mapview.msgbus.id) return;
    const step = message
    let el = document.getElementById("step-placeholder");
    el.textContent = step.toFixed(0);
  });
}


function subscribeChunks(map) {
  let msgbus = new varioscale.MessageBusConnector();
  msgbus.subscribe('data.ssc.chunksInView', (topic, message, sender) => {
    if (mapview === null || sender !== mapview.msgbus.id) return;
    const chunks = message
    let el = document.getElementById("chunks-placeholder");
    el.textContent = chunks.toFixed(0) + " chunks in view";
  });
}

function subscribeDownloads(map) {
  let msgbus = new varioscale.MessageBusConnector();
  const progressBar = document.querySelector('.start-button .progress-bar');
  const buttonText = document.querySelector('.start-button .button-text');
  const maxChunks = 133; 
  let startedDownloading = false;

  msgbus.subscribe('data.ssc.chunksDownloading', (topic, message, sender) => {
    if (mapview === null || sender !== mapview.msgbus.id) return;

      const chunks = message; 
      if (chunks > 0) {
        startedDownloading = true; 
      }
      if (startedDownloading) {
        let progress = ((maxChunks - chunks) / maxChunks) * 100;
        progressBar.style.width = progress + '%'; 

        if (progress >= 100) {
          buttonText.textContent = 'Start'; 
          progressBar.parentElement.style.animation = 'heartbeat 2s ease-in-out infinite'; 
        } else {
          buttonText.textContent = 'Loading map...'; 
          progressBar.parentElement.style.animation = 'none'; 
        }
      }
   
  });
}





function confirmCompleted(href) {
  const userConfirmed = confirm("Please make sure to submit the Google Form before proceeding.\nIf you haven't, you may now click 'Cancel' and submit it.\nClick OK to proceed to the next task.");
  if (userConfirmed) {
    window.location.href = href;
  }
}


class Tour {
  constructor() {
    this.abort = null
  }

  start(durationInMsec) {

    let i = 0
    var signal = null
    /** feeling lucky with the pdok geocoder? */
    let places = [
      { x: 210240.397, y: 541838.994, scaleDenominator: 1500 },
      { x: 104640.715, y: 488651.103, scaleDenominator: 1500 },
      { x: 133587.182, y: 455921.594, scaleDenominator: 1500 },
      { x: 237386.877, y: 582036.096, scaleDenominator: 1500 },
      { x: 78636.648, y: 438644.186, scaleDenominator: 1500 },
      { x: 122131.371, y: 487394.733, scaleDenominator: 1500 },
      { x: 79982.337, y: 454319.395, scaleDenominator: 1500 },
      { x: 189705.038, y: 445983.039, scaleDenominator: 1500 }

      //                { x: 210240.397, y: 541838.994, scaleDenominator: 24000 },
      //                { x: 104640.715, y: 488651.103, scaleDenominator: 48000 },
      //                { x: 133587.182, y: 455921.594, scaleDenominator: 48000 },
      //                { x: 237386.877, y: 582036.096, scaleDenominator: 48000 },
      //                { x: 78636.648, y: 438644.186, scaleDenominator: 48000 },
      //                { x: 122131.371, y: 487394.733, scaleDenominator: 48000 },
      //                { x: 79982.337, y: 454319.395, scaleDenominator: 48000 },
      //                { x: 189705.038, y: 445983.039, scaleDenominator: 48000 }
    ]
    function fly() {
      i %= places.length
      let whereTo = places[i]
      console.log('jumping ' + whereTo)
      i += 1
      /* hmmm... dom content loaded <> window object ? */
      mapview.flyTo(whereTo.x, whereTo.y, whereTo.scaleDenominator)
      signal = setTimeout(fly, durationInMsec)
    }
    fly()

    function abort() {
      clearTimeout(signal)
      mapview.abortAndRender()
    }
    this.abort = abort
  }

  stop() {
    if (this.abort !== null) { this.abort() }
  }
}



// -- start slider --
// let init_boundary_width_slider = () => {
//     let msgbus = new varioscale.MessageBusConnector();
//     msgbus.subscribe("settings.render.boundary-width", (topic, message, sender) => {
//         let el = document.getElementById("width-value");
//         el.innerHTML = message;
//     } );
//     let slider = document.getElementById("boundary-width");
//     slider.addEventListener('input',
//         () => {
//             msgbus.publish("settings.render.boundary-width", parseFloat(slider.value));
//         }
//     );
//     msgbus.publish("settings.render.boundary-width", parseFloat(slider.value));
// };

let init_slider = (label) => {
  let msgbus = new varioscale.MessageBusConnector();
  let slider = document.getElementById(label);
  slider.addEventListener('input',
    () => {
      msgbus.publish("settings.interaction." + label, parseFloat(slider.value) / 1000.0);
      document.getElementById(label + "-value").innerHTML = parseFloat(slider.value) / 1000.0 + "s."
      // map.abortAndRender();
    }
  );
  msgbus.publish("settings.interaction." + label, parseFloat(slider.value) / 1000.0);
}
const village_labels = [
  {
    "x": 182223.399514178,
    "y": 390490.873043865,
    "label": "Milheeze",
    "inhabitants": 0,
    "maxDenominator": 131676
  },
  {
    "x": 179474.918213331,
    "y": 390574.172772803,
    "label": "Bakel",
    "inhabitants": 0,
    "maxDenominator": 396829
  },
  {
    "x": 172380.07184815,
    "y": 391174.301462767,
    "label": "Aarle-Rixtel",
    "inhabitants": 0,
    "maxDenominator": 137700
  },
  {
    "x": 177318.234003035,
    "y": 394644.615744021,
    "label": "De Mortel",
    "inhabitants": 0,
    "maxDenominator": 289450
  },
  {
    "x": 184367.598762723,
    "y": 395844.472457547,
    "label": "De Rips",
    "inhabitants": 0,
    "maxDenominator": 308653
  },
  {
    "x": 171584.107886451,
    "y": 396763.673417536,
    "label": "Boerdonk",
    "inhabitants": 0,
    "maxDenominator": 128822
  },
  {
    "x": 180129.163950882,
    "y": 381546.314440684,
    "label": "Ommel",
    "inhabitants": 0,
    "maxDenominator": 235985
  },
  {
    "x": 172053.735651377,
    "y": 393895.473114878,
    "label": "Beek en Donk",
    "inhabitants": 0,
    "maxDenominator": 151555
  },
  {
    "x": 169449.313075798,
    "y": 392123.969606548,
    "label": "Lieshout",
    "inhabitants": 0,
    "maxDenominator": 559978
  },
  {
    "x": 175460.072794172,
    "y": 381182.640066139,
    "label": "Lierop",
    "inhabitants": 0,
    "maxDenominator": 296452
  },
  {
    "x": 185191.582636035,
    "y": 380675.363112173,
    "label": "Liessel",
    "inhabitants": 0,
    "maxDenominator": 242586
  },
  {
    "x": 180977.667269929,
    "y": 383926.709870242,
    "label": "Vlierden",
    "inhabitants": 0,
    "maxDenominator": 393725
  }
];

const extra_icons = [
    // Castles
    {
      "x": 173473.500250474,
      "y": 387593.890194573,
      "label": "\u265c",
      "inhabitants": 0,
      "maxDenominator": 66995
    },
    {
      "x": 172716.95263177,
      "y": 393912.912570259,
      "label": "\u265c",
      "inhabitants": 0,
      "maxDenominator": 17835
    },
    {
      "x": 171503.154250593,
      "y": 390141.456283994,
      "label": "\u265c",
      "inhabitants": 0,
      "maxDenominator": 25821
    },
    // {
    //   "x": 175373.243358266,
    //   "y": 396184.406611568,
    //   "label": "\u265c",
    //   "inhabitants": 0,
    //   "maxDenominator": 136465
    // },
      // Campsites
  {
    "x": 179341.749402179,
    "y": 382348.542466755,
    "label": "\u26fa",
    "inhabitants": 0,
    "maxDenominator": 40786
  },
  {
    "x": 175172,
    "y": 393124,
    "label": "\u26fa",
    "inhabitants": 0,
    "maxDenominator": 20914
  },
  // {
  //   "x": 179734.150109629,
  //   "y": 396255.582661232,
  //   "label": "\u26fa",
  //   "inhabitants": 0,
  //   "maxDenominator": 132408
  // },
  {
    "x": 168650.719834098,
    "y": 382934.423674856,
    "label": "\u26fa",
    "inhabitants": 0,
    "maxDenominator": 247000
  },
]

const extra_labels = [
  // Castles
  {
    "x": 173473.500250474,
    "y": 387593.890194573,
    "label": "     Helmond Castle",
    "inhabitants": 0,
    "maxDenominator": 10000
  },
  {
    "x": 172716.95263177,
    "y": 393912.912570259,
    "label": "     Castle Eyckenlust",
    "inhabitants": 0,
    "maxDenominator": 10000
  },
  {
    "x": 171503.154250593,
    "y": 390141.456283994,
    "label": "     Castle Croy",
    "inhabitants": 0,
    "maxDenominator": 6500
  },
  // {
  //   "x": 175373.243358266,
  //   "y": 396184.406611568,
  //   "label": "\u265c",
  //   "inhabitants": 0,
  //   "maxDenominator": 136465
  // },
    // Campsites
{
  "x": 179341.749402179,
  "y": 382348.542466755,
  "label": "      Oostappen",
  "inhabitants": 0,
  "maxDenominator": 10000
},
{
  "x": 175172,
  "y": 393124,
  "label": "      Eco-touristfarm De Biezen",
  "inhabitants": 0,
  "maxDenominator": 10000
},
// {
//   "x": 179734.150109629,
//   "y": 396255.582661232,
//   "label": "\u26fa",
//   "inhabitants": 0,
//   "maxDenominator": 132408
// },
{
  "x": 168650.719834098,
  "y": 382934.423674856,
  "label": "      Roompot Bospark",
  "inhabitants": 0,
  "maxDenominator": 10000
},
]

const icon_labels = [


  // Pubs
  {
    "x": 170504.241177486,
    "y": 385543.761935844,
    "label": "",
    "inhabitants": 0,
    "maxDenominator": 43000
  },
  {
    "x": 171145.086422586,
    "y": 383867.240701374,
    "label": "",
    "inhabitants": 0,
    "maxDenominator": 1784
  },
  {
    "x": 169331.459683642,
    "y": 392455.388330675,
    "label": "",
    "inhabitants": 0,
    "maxDenominator": 65000
  },
  {
    "x": 179953.091471057,
    "y": 379546.990640699,
    "label": "",
    "inhabitants": 0,
    "maxDenominator": 8200
  },
  {
    "x": 173682.07329283,
    "y": 387830.87916416,
    "label": "",
    "inhabitants": 0,
    "maxDenominator": 2400
  },
  {
    "x": 169332.000181224,
    "y": 392534.000736112,
    "label": "",
    "inhabitants": 0,
    "maxDenominator": 14486
  },
  {
    "x": 173402.789388214,
    "y": 387780.671139573,
    "label": "",
    "inhabitants": 0,
    "maxDenominator": 25764
  },
  {
    "x": 180808.997083601,
    "y": 384017.99869305,
    "label": "",
    "inhabitants": 0,
    "maxDenominator": 21940
  },
  {
    "x": 173733.658927527,
    "y": 387951.511696374,
    "label": "",
    "inhabitants": 0,
    "maxDenominator": 25764
  },
  {
    "x": 175390.188118963,
    "y": 396403.009817622,
    "label": "",
    "inhabitants": 0,
    "maxDenominator": 42638
  },
  {
    "x": 173757.36432128,
    "y": 387699.523879695,
    "label": "",
    "inhabitants": 0,
    "maxDenominator": 14344
  },
  // // Supermarkets
  // {
  //   "x": 183468.482794836,
  //   "y": 385992.709141974,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 176878.535181653,
  //   "y": 386826.371951648,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 173513.564510391,
  //   "y": 388411.297616618,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 174473.478772247,
  //   "y": 389564.796115266,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 172147.851456691,
  //   "y": 386316.178458203,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 182670.997955976,
  //   "y": 384758.004127783,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 184728.000975297,
  //   "y": 385259.998008532,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 172917.750933185,
  //   "y": 387473.186966297,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 174469.036246678,
  //   "y": 389641.865925158,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 183977.001571761,
  //   "y": 385313.998252748,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 172210.397936338,
  //   "y": 386477.951050671,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 176920.503622253,
  //   "y": 386781.295926033,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 174971.22258308,
  //   "y": 387530.091852174,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 179870.996826541,
  //   "y": 379634.999865994,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 170540.125149782,
  //   "y": 385649.806025848,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 179921.001872006,
  //   "y": 379639.995808637,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 185073.002757047,
  //   "y": 380829.000451478,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 182623.252878498,
  //   "y": 385979.539229006,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 182507.889951377,
  //   "y": 385338.547924184,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 183150.99759607,
  //   "y": 385933.00452669,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 171151.954392946,
  //   "y": 383834.821557052,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 170453.398762554,
  //   "y": 385754.273103845,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 171238.057543886,
  //   "y": 388482.171353597,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 177174.751524599,
  //   "y": 387485.498227784,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 169392.002400585,
  //   "y": 392499.004415708,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 171750.002933179,
  //   "y": 394442.999232713,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 176934.373821722,
  //   "y": 386817.891383556,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 172159.002909004,
  //   "y": 393338.998983143,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 172017.003530273,
  //   "y": 393372.005798232,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 173288.175137167,
  //   "y": 391386.670684533,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 172319.235951993,
  //   "y": 391231.22083778,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 172110.715987476,
  //   "y": 386770.539961909,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 174108.002613638,
  //   "y": 386991.446008394,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 175381.412378883,
  //   "y": 388034.032400902,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 174304.5388797,
  //   "y": 388334.519014005,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 173825.978136577,
  //   "y": 387931.728758522,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 174477.889954317,
  //   "y": 388844.742093362,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 175725.883717601,
  //   "y": 396967.3848028,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 175644.268737642,
  //   "y": 396110.155717232,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 175368.160951334,
  //   "y": 396496.128848341,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 175545.797214783,
  //   "y": 396490.384718429,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 180047.46978921,
  //   "y": 379508.472916068,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 171098.697155281,
  //   "y": 383691.159378694,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 171094.535348681,
  //   "y": 383703.417231139,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 172111.487609369,
  //   "y": 386106.478702446,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 179683.74308957,
  //   "y": 390138.618631844,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 174278.180544358,
  //   "y": 388280.983959677,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 170516.617702491,
  //   "y": 383854.18459971,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 177053.791855859,
  //   "y": 386978.024469285,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 180150.619226401,
  //   "y": 379376.926466534,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 168997.549700129,
  //   "y": 383480.369647568,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 179759.467403165,
  //   "y": 390555.209563719,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },
  // {
  //   "x": 173225.4358568,
  //   "y": 387824.396701536,
  //   "label": "\uf291",
  //   "inhabitants": 0
  // },

  // Cafes

  {
    "x": 168548.044092039,
    "y": 384961.253070852,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 57000
  },
  {
    "x": 175493.002496404,
    "y": 381383.994834962,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 34900
  },
  {
    "x": 171641.001480362,
    "y": 396842.994780522,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 14000
  },
  {
    "x": 173556.996893653,
    "y": 380673.002714985,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 4631
  },
  {
    "x": 180126.001088686,
    "y": 381493.998841599,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 7056
  },
  {
    "x": 179987.003371621,
    "y": 379500.998880408,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 1100
  },
  {
    "x": 180004.003391824,
    "y": 379713.997935772,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 29000
  },
  {
    "x": 179816.001178538,
    "y": 379571.995140668,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 16000
  },
  {
    "x": 169476.003517338,
    "y": 392110.996094241,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 2000
  },
  {
    "x": 172409.000866886,
    "y": 391153.997289905,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 3012
  },
  {
    "x": 172568.000262556,
    "y": 391296.00482942,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 17700
  },
  {
    "x": 173634.264529241,
    "y": 387781.896477149,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 5500
  },
  {
    "x": 175553.7965427,
    "y": 396044.881555701,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 26000
  },
  {
    "x": 182354.069692884,
    "y": 390517.288775096,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 6094
  },
  {
    "x": 177289.033572214,
    "y": 394658.794001933,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 3662
  },
  {
    "x": 180641.022806256,
    "y": 380903.455487006,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 59427
  },
  {
    "x": 175266.935668778,
    "y": 388645.261549608,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 46569
  },
  {
    "x": 168948.044837464,
    "y": 383351.904313717,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 79000
  },
  {
    "x": 180019.052645149,
    "y": 379688.840053414,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 2000
  },
  {
    "x": 180039.290082959,
    "y": 379682.565147769,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 4749
  },
  {
    "x": 174847.547588327,
    "y": 389141.265109265,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 88642
  },
  {
    "x": 173221.813484407,
    "y": 387815.594723138,
    "label": "\uf0f4",
    "inhabitants": 0,
    "maxDenominator": 34000
  },
  // // churches
  // {
  //   "x": 174549.560528492,
  //   "y": 387811.026704313,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 180196.476509474,
  //   "y": 381425.316290121,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 176777.258197778,
  //   "y": 386381.792459692,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 174204.29476921,
  //   "y": 388841.55237886,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 174577.864406641,
  //   "y": 388150.726144111,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 171041.377241511,
  //   "y": 383316.133791938,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 172258.172770785,
  //   "y": 393408.707645609,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 177596.601778966,
  //   "y": 386638.553369548,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 173707.156798553,
  //   "y": 387753.892512033,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 171929.877498553,
  //   "y": 384210.159713451,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 171583.73546085,
  //   "y": 396899.173668033,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 175520.503563178,
  //   "y": 382283.507499377,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 175493.173862879,
  //   "y": 381159.190280452,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 180215.271907863,
  //   "y": 381428.948986556,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 180786.696382835,
  //   "y": 384038.928105356,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 179829.432487304,
  //   "y": 379348.612751128,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 185158.878364991,
  //   "y": 380657.462809126,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 184063.141365496,
  //   "y": 386913.764690924,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 182671.623389525,
  //   "y": 384874.882315034,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 183341.481306497,
  //   "y": 386233.068260533,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 183213.02313933,
  //   "y": 386149.199689335,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 171032.547417371,
  //   "y": 388593.241994988,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 177223.468556972,
  //   "y": 387512.707504288,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 169578.377941977,
  //   "y": 392108.79166119,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 174250.438091844,
  //   "y": 393122.665586112,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 172354.567850794,
  //   "y": 391005.930340025,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 172461.409296448,
  //   "y": 391304.297911597,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 172136.251406846,
  //   "y": 386468.786123443,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 172784.543362976,
  //   "y": 387221.35142642,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 174952.93120065,
  //   "y": 389152.959969277,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 174657.676520955,
  //   "y": 397158.294969963,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 174829.695498381,
  //   "y": 396226.424252819,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 175353.070670163,
  //   "y": 396271.388611658,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 182252.450571293,
  //   "y": 390486.555645296,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 177332.79868606,
  //   "y": 394673.322473485,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 181554.8773002,
  //   "y": 390355.244867808,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 184315.86540174,
  //   "y": 395823.276861997,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 184565.220194532,
  //   "y": 395431.560985619,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 179599.778365735,
  //   "y": 390661.484681886,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 177307.366278191,
  //   "y": 394727.441442142,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // },
  // {
  //   "x": 171592.610116367,
  //   "y": 396949.812883323,
  //   "label": "\u271d",
  //   "inhabitants": 0,
  //   "maxDenominator": 1000000
  // }


];
const town_labels = [
  {
    "x": 179957.107940602,
    "y": 379500.017297429,
    "label": "Asten",
    "inhabitants": 0,
    "maxDenominator": 1000000
  },
  {
    "x": 173656.95459046,
    "y": 387817.347206801,
    "label": "Helmond",
    "inhabitants": 0,
    "maxDenominator": 1000000
  },
  {
    "x": 171097.805429273,
    "y": 383877.670263556,
    "label": "Mierlo",
    "inhabitants": 0,
    "maxDenominator": 497073
  },
  {
    "x": 175752.453726321,
    "y": 396713.246833602,
    "label": "Gemert",
    "inhabitants": 0,
    "maxDenominator": 1000000
  },
  {
    "x": 183312.883873245,
    "y": 386166.415813682,
    "label": "Deurne",
    "inhabitants": 0,
    "maxDenominator": 278322
  }
];
const hamlet_labels = [
  {
    "x": 186090.380029826,
    "y": 379560.514553962,
    "label": "Sloot",
    "inhabitants": 0,
    "maxDenominator": 179005
  },
  {
    "x": 184141.485606838,
    "y": 379930.520023328,
    "label": "Leensel",
    "inhabitants": 0,
    "maxDenominator": 76090
  },
  {
    "x": 182710.646011411,
    "y": 379983.066720627,
    "label": "Rinkveld",
    "inhabitants": 0,
    "maxDenominator": 134843
  },
  {
    "x": 181174.574777875,
    "y": 380470.326444481,
    "label": "Stegen",
    "inhabitants": 0,
    "maxDenominator": 66430
  },
  {
    "x": 181426.313485893,
    "y": 382827.391188964,
    "label": "Baarschot",
    "inhabitants": 0,
    "maxDenominator": 148000
  },
  {
    "x": 182995.456420264,
    "y": 383251.547591908,
    "label": "Heimolen",
    "inhabitants": 0,
    "maxDenominator": 99398
  },
  {
    "x": 180084.589543059,
    "y": 383526.605169652,
    "label": "Belgeren",
    "inhabitants": 0,
    "maxDenominator": 72900
  },
  {
    "x": 182223.126831023,
    "y": 383723.603397896,
    "label": "Heieind",
    "inhabitants": 0,
    "maxDenominator": 47173
  },
  {
    "x": 178595.992304483,
    "y": 383694.009503021,
    "label": "Voorste Beersdonk",
    "inhabitants": 0,
    "maxDenominator": 35501
  },
  {
    "x": 177736.771868839,
    "y": 383822.804994749,
    "label": "Beersdonk",
    "inhabitants": 0,
    "maxDenominator": 130903
  },
  {
    "x": 184586.405337855,
    "y": 383950.458920519,
    "label": "Breemortel",
    "inhabitants": 0,
    "maxDenominator": 146979
  },
  {
    "x": 181767.705675032,
    "y": 384050.330481673,
    "label": "Vloeieind",
    "inhabitants": 0,
    "maxDenominator": 37378
  },
  {
    "x": 185957.112664228,
    "y": 384227.882797001,
    "label": "Pannenschop",
    "inhabitants": 0,
    "maxDenominator": 61656
  },
  {
    "x": 181578.08576695,
    "y": 384365.491340827,
    "label": "Hondseind",
    "inhabitants": 0,
    "maxDenominator": 99600
  },
  {
    "x": 177486.70093407,
    "y": 385400.79709156,
    "label": "De Weijer",
    "inhabitants": 0,
    "maxDenominator": 71909
  },
  {
    "x": 185419.898346659,
    "y": 385676.490893262,
    "label": "Merlenberg",
    "inhabitants": 0,
    "maxDenominator": 72768
  },
  {
    "x": 184801.609574288,
    "y": 386012.027524555,
    "label": "Kulert",
    "inhabitants": 0,
    "maxDenominator": 51746
  },
  {
    "x": 182763.577129897,
    "y": 386937.831888453,
    "label": "Kerkeind",
    "inhabitants": 0,
    "maxDenominator": 145942
  },
  {
    "x": 180981.221990304,
    "y": 387690.611494805,
    "label": "Groot Bruggen",
    "inhabitants": 0,
    "maxDenominator": 214844
  },
  {
    "x": 182772.822817516,
    "y": 387865.20307512,
    "label": "Voort",
    "inhabitants": 0,
    "maxDenominator": 58416
  },
  {
    "x": 180631.974398912,
    "y": 387865.945947341,
    "label": "Klein Bruggen",
    "inhabitants": 0,
    "maxDenominator": 33648
  },
  {
    "x": 179461.351815448,
    "y": 388423.972307439,
    "label": "Molenhof",
    "inhabitants": 0,
    "maxDenominator": 139399
  },
  {
    "x": 178808.058911991,
    "y": 388601.197651113,
    "label": "Schouw",
    "inhabitants": 0,
    "maxDenominator": 33034
  },
  {
    "x": 179403.595984708,
    "y": 388694.43903691,
    "label": "Heidveld",
    "inhabitants": 0,
    "maxDenominator": 31091
  },
  {
    "x": 180071.312379626,
    "y": 388916.582981364,
    "label": "Kuundert",
    "inhabitants": 0,
    "maxDenominator": 11640
  },
  {
    "x": 179832.476495027,
    "y": 388919.688421405,
    "label": "Hilakker",
    "inhabitants": 0,
    "maxDenominator": 74074
  },
  {
    "x": 178437.092105704,
    "y": 389266.939381485,
    "label": "Ravensgat",
    "inhabitants": 0,
    "maxDenominator": 20896
  },
  {
    "x": 183181.898121351,
    "y": 389683.124625643,
    "label": "Bankert",
    "inhabitants": 0,
    "maxDenominator": 207073
  },
  {
    "x": 177797.37458259,
    "y": 389871.323969899,
    "label": "Mathijseind",
    "inhabitants": 0,
    "maxDenominator": 19648
  },
  {
    "x": 177530.063227151,
    "y": 389979.665941009,
    "label": "Muizenhol",
    "inhabitants": 0,
    "maxDenominator": 106571
  },
  {
    "x": 171693.346091412,
    "y": 390180.09458223,
    "label": "Strijp",
    "inhabitants": 0,
    "maxDenominator": 108257
  },
  {
    "x": 182992.803447126,
    "y": 390289.798408447,
    "label": "Hoeven",
    "inhabitants": 0,
    "maxDenominator": 31125
  },
  {
    "x": 175459.282464312,
    "y": 390440.29674649,
    "label": "Scheepstal",
    "inhabitants": 0,
    "maxDenominator": 44981
  },
  {
    "x": 172928.457426432,
    "y": 390649.591476542,
    "label": "Rixtel",
    "inhabitants": 0,
    "maxDenominator": 70573
  },
  {
    "x": 175308.813230651,
    "y": 390675.490438554,
    "label": "Wolfsput",
    "inhabitants": 0,
    "maxDenominator": 35103
  },
  {
    "x": 177899.787905537,
    "y": 390985.941369977,
    "label": "Nuijeneind",
    "inhabitants": 0,
    "maxDenominator": 94730
  },
  {
    "x": 168474.540484006,
    "y": 391350.265674049,
    "label": "Deense Hoek",
    "inhabitants": 0,
    "maxDenominator": 103985
  },
  {
    "x": 180068.835730227,
    "y": 391324.437505771,
    "label": "Zand",
    "inhabitants": 0,
    "maxDenominator": 34656
  },
  {
    "x": 169157.070958913,
    "y": 391291.298510734,
    "label": "'t Hof",
    "inhabitants": 0,
    "maxDenominator": 25193
  },
  {
    "x": 174564.638466776,
    "y": 391465.621351044,
    "label": "Heikant",
    "inhabitants": 0,
    "maxDenominator": 73890
  },
  {
    "x": 178404.171369976,
    "y": 391810.411662354,
    "label": "Neerstraat",
    "inhabitants": 0,
    "maxDenominator": 55896
  },
  {
    "x": 176140.900122546,
    "y": 391893.893404903,
    "label": "Speurgt",
    "inhabitants": 0,
    "maxDenominator": 263000
  },
  {
    "x": 180067.703611841,
    "y": 391999.417613327,
    "label": "Ven",
    "inhabitants": 0,
    "maxDenominator": 38414
  },
  {
    "x": 179183.042766268,
    "y": 392093.323026607,
    "label": "Zaarvlaas",
    "inhabitants": 0,
    "maxDenominator": 179435
  },
  {
    "x": 178257.403120675,
    "y": 392177.982507939,
    "label": "Esp",
    "inhabitants": 0,
    "maxDenominator": 70915
  },
  {
    "x": 176151.379061694,
    "y": 392541.429481997,
    "label": "Grotel",
    "inhabitants": 0,
    "maxDenominator": 106125
  },
  {
    "x": 169806.735379884,
    "y": 392972.791458544,
    "label": "Beemdkant",
    "inhabitants": 0,
    "maxDenominator": 70709
  },
  {
    "x": 174671.383130409,
    "y": 393170.9179493,
    "label": "De Biezen",
    "inhabitants": 0,
    "maxDenominator": 89957
  },
  {
    "x": 175705.297664728,
    "y": 393306.471411403,
    "label": "Tereyken",
    "inhabitants": 0,
    "maxDenominator": 50614
  },
  {
    "x": 178074.259657351,
    "y": 393422.756878478,
    "label": "Hoogen-Aarle",
    "inhabitants": 0,
    "maxDenominator": 66989
  },
  {
    "x": 176732.638835976,
    "y": 393584.934963042,
    "label": "Milschot",
    "inhabitants": 0,
    "maxDenominator": 93041
  },
  {
    "x": 173387.963056277,
    "y": 394077.200601019,
    "label": "Broekkant",
    "inhabitants": 0,
    "maxDenominator": 35990
  },
  {
    "x": 177024.529443236,
    "y": 394170.756392414,
    "label": "Ren",
    "inhabitants": 0,
    "maxDenominator": 70573
  },
  {
    "x": 169715.996749728,
    "y": 394397.525227134,
    "label": "Donkersvoort",
    "inhabitants": 0,
    "maxDenominator": 71782
  },
  {
    "x": 170877.406522269,
    "y": 394395.179414976,
    "label": "Heereind",
    "inhabitants": 0,
    "maxDenominator": 35931
  },
  {
    "x": 170512.403032999,
    "y": 394786.955946094,
    "label": "Karstraat",
    "inhabitants": 0,
    "maxDenominator": 63380
  },
  {
    "x": 171413.533402293,
    "y": 395766.457993788,
    "label": "Bemmer",
    "inhabitants": 0,
    "maxDenominator": 236917
  },
  {
    "x": 174272.74525289,
    "y": 397341.391012067,
    "label": "Pandelaarse Kampen",
    "inhabitants": 0,
    "maxDenominator": 115932
  },
  {
    "x": 180287.505839806,
    "y": 382221.583063574,
    "label": "Ommelse Bos",
    "inhabitants": 0,
    "maxDenominator": 64320
  },
  {
    "x": 181481.567827102,
    "y": 381316.641501695,
    "label": "De Berken",
    "inhabitants": 0,
    "maxDenominator": 60602
  },
  {
    "x": 177904.36774598,
    "y": 383032.175862881,
    "label": "Oostappen",
    "inhabitants": 0,
    "maxDenominator": 156470
  },
  {
    "x": 172115.793404836,
    "y": 384065.341228066,
    "label": "Bekelaar",
    "inhabitants": 0,
    "maxDenominator": 42729
  },
  {
    "x": 171852.123461355,
    "y": 383852.188413953,
    "label": "Loeswijk",
    "inhabitants": 0,
    "maxDenominator": 28955
  },
  {
    "x": 172663.05540199,
    "y": 385580.782139053,
    "label": "Ganzewinkel",
    "inhabitants": 0,
    "maxDenominator": 90701
  },
  {
    "x": 170053.668014858,
    "y": 386171.765180469,
    "label": "Diepenbroek",
    "inhabitants": 0,
    "maxDenominator": 41002
  },
  {
    "x": 170352.378261006,
    "y": 386512.537036861,
    "label": "Berenbroek",
    "inhabitants": 0,
    "maxDenominator": 113399
  },
  {
    "x": 170903.429480616,
    "y": 386397.234733054,
    "label": "Medevoort",
    "inhabitants": 0,
    "maxDenominator": 24698
  },
  {
    "x": 171464.652022747,
    "y": 382537.74186048,
    "label": "De Loo",
    "inhabitants": 0,
    "maxDenominator": 46668
  },
  {
    "x": 171162.239231251,
    "y": 382175.389102785,
    "label": "Trimpert",
    "inhabitants": 0,
    "maxDenominator": 82841
  },
  {
    "x": 171408.071559259,
    "y": 392296.07128131,
    "label": "Het Laar",
    "inhabitants": 0,
    "maxDenominator": 56568
  },
  {
    "x": 170552.230289271,
    "y": 392453.89129716,
    "label": "Het Hool",
    "inhabitants": 0,
    "maxDenominator": 42592
  },
  {
    "x": 171405.90293693,
    "y": 392698.976214482,
    "label": "Groenewoud",
    "inhabitants": 0,
    "maxDenominator": 130124
  },
  {
    "x": 177566.838133704,
    "y": 388522.483350438,
    "label": "Rijpelberg",
    "inhabitants": 0,
    "maxDenominator": 70699
  },
  {
    "x": 174661.762467306,
    "y": 383574.19386405,
    "label": "Eindje",
    "inhabitants": 0,
    "maxDenominator": 149912
  },
  {
    "x": 171612.416316375,
    "y": 390102.363081087,
    "label": "Croy",
    "inhabitants": 0,
    "maxDenominator": 13903
  },
  {
    "x": 176868.544330025,
    "y": 384985.398564841,
    "label": "Kloostereind",
    "inhabitants": 0,
    "maxDenominator": 247347
  },
  {
    "x": 175194.187405338,
    "y": 380494.04715337,
    "label": "Berkeindje",
    "inhabitants": 0,
    "maxDenominator": 39667
  },
  {
    "x": 173566.968733767,
    "y": 380702.609979627,
    "label": "Moorsel",
    "inhabitants": 0,
    "maxDenominator": 112047
  },
  {
    "x": 174699.479616912,
    "y": 380987.55066373,
    "label": "Heieind",
    "inhabitants": 0,
    "maxDenominator": 50922
  },
  {
    "x": 176275.762203583,
    "y": 381098.954057125,
    "label": "Boomen",
    "inhabitants": 0,
    "maxDenominator": 41314
  },
  {
    "x": 172127.430265848,
    "y": 381757.66040636,
    "label": "Voortje",
    "inhabitants": 0,
    "maxDenominator": 222259
  },
  {
    "x": 184462.29383801,
    "y": 382510.081581942,
    "label": "Hoogdonk",
    "inhabitants": 0,
    "maxDenominator": 228130
  },
  {
    "x": 183849.251284878,
    "y": 384098.335941934,
    "label": "Vreekwijk",
    "inhabitants": 0,
    "maxDenominator": 35324
  },
  {
    "x": 184908.174415692,
    "y": 381398.099529632,
    "label": "Loon",
    "inhabitants": 0,
    "maxDenominator": 133832
  },
  {
    "x": 181349.373289087,
    "y": 389123.611487001,
    "label": "Kaweide",
    "inhabitants": 0,
    "maxDenominator": 128278
  },
  {
    "x": 180076.302213331,
    "y": 390045.238836172,
    "label": "Overschot",
    "inhabitants": 0,
    "maxDenominator": 79854
  },
  {
    "x": 178592.568099102,
    "y": 389968.57870351,
    "label": "Rootvlaas",
    "inhabitants": 0,
    "maxDenominator": 46594
  },
  {
    "x": 181712.609636426,
    "y": 390447.76450972,
    "label": "Schutsboom",
    "inhabitants": 0,
    "maxDenominator": 19834
  },
  {
    "x": 177889.523821288,
    "y": 389361.700789071,
    "label": "Bakelsebrug",
    "inhabitants": 0,
    "maxDenominator": 129523
  },
  {
    "x": 177713.056248448,
    "y": 393015.168654301,
    "label": "Kivietsbraak",
    "inhabitants": 0,
    "maxDenominator": 238312
  },
  {
    "x": 169587.570770209,
    "y": 384666.053359613,
    "label": "Het Broek",
    "inhabitants": 0,
    "maxDenominator": 30363
  },
  {
    "x": 172586.631083026,
    "y": 385085.221812401,
    "label": "Goor",
    "inhabitants": 0,
    "maxDenominator": 117444
  },
  {
    "x": 171549.953462417,
    "y": 382815.993553423,
    "label": "Overakker",
    "inhabitants": 0,
    "maxDenominator": 119198
  },
  {
    "x": 173587.56279887,
    "y": 383100.888604277,
    "label": "Winkelstraat",
    "inhabitants": 0,
    "maxDenominator": 59735
  },
  {
    "x": 174289.252591586,
    "y": 382696.439968643,
    "label": "Gebergte",
    "inhabitants": 0,
    "maxDenominator": 150000
  },
  {
    "x": 168672.958009755,
    "y": 384602.913372452,
    "label": "Heiderschoor",
    "inhabitants": 0,
    "maxDenominator": 172000
  },
  {
    "x": 169630.362734468,
    "y": 385805.984998207,
    "label": "Kranenbroek",
    "inhabitants": 0,
    "maxDenominator": 297891
  },
  {
    "x": 175783.822658195,
    "y": 383969.669139795,
    "label": "Stipdonk",
    "inhabitants": 0,
    "maxDenominator": 96931
  },
  {
    "x": 174719.749889817,
    "y": 383155.788395224,
    "label": "Hersel",
    "inhabitants": 0,
    "maxDenominator": 40118
  },
  {
    "x": 175877.567245501,
    "y": 382420.332211523,
    "label": "Achterbroek",
    "inhabitants": 0,
    "maxDenominator": 67202
  },
  {
    "x": 174452.667465916,
    "y": 381533.92418407,
    "label": "Oeijenbraak",
    "inhabitants": 0,
    "maxDenominator": 70022
  },
  {
    "x": 175322.769726139,
    "y": 379838.730019158,
    "label": "Vaarsche Hoef",
    "inhabitants": 0,
    "maxDenominator": 159282
  },
  {
    "x": 176197.173903414,
    "y": 380396.211853267,
    "label": "Otterdijk",
    "inhabitants": 0,
    "maxDenominator": 72634
  },
  {
    "x": 176600.336368491,
    "y": 379813.783576395,
    "label": "Vlerken",
    "inhabitants": 0,
    "maxDenominator": 43205
  },
  {
    "x": 176029.601212149,
    "y": 390710.811077987,
    "label": "Scheepstal",
    "inhabitants": 0,
    "maxDenominator": 54384
  },
  {
    "x": 169975.051791241,
    "y": 389685.504964181,
    "label": "Kruisschot",
    "inhabitants": 0,
    "maxDenominator": 117008
  },
  {
    "x": 170216.065776954,
    "y": 389129.930278533,
    "label": "Geeneind",
    "inhabitants": 0,
    "maxDenominator": 371163
  },
  {
    "x": 175737.784294763,
    "y": 388755.429473824,
    "label": "Kruisschot",
    "inhabitants": 0,
    "maxDenominator": 117000
  },
  {
    "x": 172933.454758272,
    "y": 389763.04948585,
    "label": "Overbrug",
    "inhabitants": 0,
    "maxDenominator": 154906
  },
  {
    "x": 173318.608336341,
    "y": 382253.926630754,
    "label": "Broekkant",
    "inhabitants": 0,
    "maxDenominator": 34088
  },
  {
    "x": 178376.71310546,
    "y": 389806.304062799,
    "label": "Benthem",
    "inhabitants": 0,
    "maxDenominator": 29350
  },
  {
    "x": 168459.63316355,
    "y": 393925.503898318,
    "label": "Ginderdoor",
    "inhabitants": 0,
    "maxDenominator": 130124
  },
  {
    "x": 185938.628501482,
    "y": 384857.13303505,
    "label": "Voorpeel",
    "inhabitants": 0,
    "maxDenominator": 173400
  },
  {
    "x": 177867.34431902,
    "y": 381711.897562847,
    "label": "Voorste Diesdonk",
    "inhabitants": 0,
    "maxDenominator": 62188
  },
  {
    "x": 177698.907355051,
    "y": 381203.829435897,
    "label": "Bussel",
    "inhabitants": 0,
    "maxDenominator": 115555
  },
  {
    "x": 178258.315995101,
    "y": 380760.175850151,
    "label": "Vosselen",
    "inhabitants": 0,
    "maxDenominator": 71793
  },
  {
    "x": 178462.873470388,
    "y": 381088.501036559,
    "label": "De Beek",
    "inhabitants": 0,
    "maxDenominator": 48482
  },
  {
    "x": 177514.965736292,
    "y": 380711.129067779,
    "label": "Dijk",
    "inhabitants": 0,
    "maxDenominator": 103034
  },
  {
    "x": 182892.788758125,
    "y": 382798.369769403,
    "label": "Donschot",
    "inhabitants": 0,
    "maxDenominator": 63395
  },
  {
    "x": 177678.516307927,
    "y": 382312.891646901,
    "label": "Achterste Diesdonk",
    "inhabitants": 0,
    "maxDenominator": 153010
  },
  {
    "x": 183536.247116603,
    "y": 391603.016768092,
    "label": "Klef",
    "inhabitants": 0,
    "maxDenominator": 279464
  },
  {
    "x": 173382.218609458,
    "y": 393668.948753557,
    "label": "Peeldijk",
    "inhabitants": 0,
    "maxDenominator": 34088
  },
  {
    "x": 179665.021110437,
    "y": 380528.787601441,
    "label": "Laarbroek",
    "inhabitants": 0,
    "maxDenominator": 162500
  },
  {
    "x": 179327.397112424,
    "y": 391295.528174626,
    "label": "Geneneind",
    "inhabitants": 0,
    "maxDenominator": 74675
  },
  {
    "x": 185180.332798517,
    "y": 384572.632770082,
    "label": "Hanenberg",
    "inhabitants": 0,
    "maxDenominator": 52778
  }
];

const quarter_labels = [
  {
    "x": 176821.579339781,
    "y": 385805.950658372,
    "label": "Brouwhuis",
    "inhabitants": 0,
    "maxDenominator": 1000000
  },
  {
    "x": 170638.696300615,
    "y": 385986.802416252,
    "label": "Brandevoort",
    "inhabitants": 0,
    "maxDenominator": 1000000
  },
  {
    "x": 172194.839271441,
    "y": 386473.993225609,
    "label": "Mierlo-Hout",
    "inhabitants": 0,
    "maxDenominator": 1000000
  },
  {
    "x": 170960.290326777,
    "y": 388675.222177583,
    "label": "Stiphout",
    "inhabitants": 0,
    "maxDenominator": 1000000
  },
  {
    "x": 176264.03596714,
    "y": 389381.608235326,
    "label": "Dierdonk",
    "inhabitants": 0,
    "maxDenominator": 1000000
  },
  {
    "x": 177175.765986005,
    "y": 387444.239028357,
    "label": "Rijpelberg",
    "inhabitants": 0,
    "maxDenominator": 1000000
  },
  {
    "x": 174416.796688315,
    "y": 389443.813555922,
    "label": "Helmond-Noord",
    "inhabitants": 0,
    "maxDenominator": 1000000
  },
  {
    "x": 174237.20638461,
    "y": 388125.163581017,
    "label": "Binnenstad",
    "inhabitants": 0,
    "maxDenominator": 1000000
  },
  {
    "x": 175385.521952296,
    "y": 387807.104851307,
    "label": "Helmond-Oost",
    "inhabitants": 0,
    "maxDenominator": 1000000
  },
  {
    "x": 173245.212057764,
    "y": 387144.605171022,
    "label": "Helmond-West",
    "inhabitants": 0,
    "maxDenominator": 1000000
  },
  {
    "x": 172744.760662578,
    "y": 388477.686173822,
    "label": "Warande",
    "inhabitants": 0,
    "maxDenominator": 1000000
  }
]


