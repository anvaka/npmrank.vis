var eventify = require('ngraph.events');

module.exports = createAudioReader;

function createAudioReader() {
  var api = {
    getByteFrequency: getByteFrequency
  };
  eventify(api);
  start();

  return api;

  function start() {
    if (!window.AudioContext) return;
    var audioContext = new window.AudioContext();
    var analyser = audioContext.createAnalyser();
    analyser.smoothingTimeConstant = 0.1;
    analyser.fftSize = 1024;
    var source, dataArray, bufferLength;

    document.addEventListener('drop', onMP3Drop, false);
    document.addEventListener('dragover', allowDrop, false);
  }

  function allowDrop(e) {
    e.preventDefault();
  }

  function onMP3Drop(e) {
    e.stopPropagation();
    e.preventDefault();

    var droppedFiles = e.dataTransfer.files;
    var reader = new FileReader();
    reader.onload = function(fileEvent) {
      var data = fileEvent.target.result;
      onDroppedMP3Loaded(data);
    };
    reader.readAsArrayBuffer(droppedFiles[0]);
  }

  function onDroppedMP3Loaded(data) {
    audioContext.decodeAudioData(data, startSound, function(e) {
      console.log(e);
    });
  }

  function startSound(audioBuffer) {
    if (source) {
      source.stop(0.0);
      source.disconnect();
    }

    // Connect audio processing graph
    source = audioContext.createBufferSource();
    source.connect(audioContext.destination);
    source.connect(analyser);

    source.buffer = audioBuffer;
    source.start(0.0);

    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    api.fire('ready', bufferLength);
  }

  function getByteFrequency() {
    analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}
