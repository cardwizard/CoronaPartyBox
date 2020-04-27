// Drag drop box for midi selection
if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
	document.querySelector("#FileDrop #Text").textContent = "Reading files not supported by this browser";
} else {

	const fileDrop = document.querySelector("#FileDrop")

	fileDrop.addEventListener("dragenter", () => fileDrop.classList.add("Hover"))

	fileDrop.addEventListener("dragleave", () => fileDrop.classList.remove("Hover"))

	fileDrop.addEventListener("drop", () => fileDrop.classList.remove("Hover"))

	document.querySelector("#FileDrop input").addEventListener("change", e => {
		//get the files
		const files = e.target.files
		if (files.length > 0){
			const file = files[0]
			document.querySelector("#FileDrop #Text").textContent = file.name
			parseFile(file)
		}
	})
}

let currentMidi = null;
var tempo = 0;

function parseFile(file){
	//read the file
	const reader = new FileReader()
	reader.onload = function(e){
		const midi = new Midi(e.target.result)
		document.querySelector("#ResultsText").value = JSON.stringify(midi, undefined, 2)
		document.querySelector('tone-play-toggle').removeAttribute('disabled')
		currentMidi = midi

		tempo = midi.header.tempos[0].bpm;
	}
	reader.readAsArrayBuffer(file)
}

const synths = []

var svg = d3.select('.container')
.append('svg')
.attr('height', 500)
.attr('width', 1000);

var num_players = 4;
var colors = ['red','blue','green','yellow']

// Black bar hit marker
var marker = svg.append('rect')
.attr('fill', 'black')
.attr('height', num_players * 50)
.attr('width', 3)
.attr('x', 0)
.attr('y', 0);

var markers = [];
var blocks = [];
var notes = [];


// Initialize blocks, notes, and markers
var i = 0;
for (i = 0; i < num_players; i++) {
	markers.push(
		svg.append('rect')
		.attr('fill', colors[i])
		.attr('height', 50)
		.attr('width', 5)
		.attr('x', 0)
		.attr('y', i * 50)
		.style("visibility", "hidden")
	)
	blocks.push([]);
	notes.push([]);
}

// Add blocks based on notes in midi
document.querySelector('tone-play-toggle').addEventListener('play', (e) => {
	const playing = e.detail
	if (playing && currentMidi){
		const now = Tone.now() + 0.5
		currentMidi.tracks.forEach(function (track, i) {
			//create a synth for each track
			synth = new Tone.PolySynth(10, Tone.Synth, {
				envelope : {
					attack : 0.02,
					decay : 0.1,
					sustain : 0.3,
					release : 1
				}
			}).toMaster()
			synths.push(synth)
			//schedule all of the events
			track.notes.forEach(note => {

				//synth.triggerAttackRelease(note.name, note.duration, note.time + now, note.velocity)

				var random = Math.floor(Math.random() * num_players); 

				var block = svg.append('rect')
				.attr('fill', colors[random])
				.attr('height', 15)
				.attr('width', note.duration * 100 - 3)
				.attr('x', note.time * 100)
				.attr('y', 20 + random * 50);

				blocks[random].push(block);
				notes[random].push(note);
			})
		})
	} else {
		//dispose the synth and make a new one
		while(synths.length){
			const synth = synths.shift()
			synth.dispose()
		}
	}
})

function moveBlocks(){
	var i = 0;
	var toRemove = [];
	for (i = 0; i < num_players; i++) {
		blocks[i].forEach(block => {
			block.attr('x', block.attr('x') - 10);//tempo / 600 * (60/tempo*100));

			if (block.attr('x') < 500 && block.attr('x') > -500) {
				block.style("visibility", "visible");
			}
			else {
				block.style("visibility", "hidden");
				//toRemove.push(i);
			}

		})

		// Remove blocks if they pass the x = 0 mark. 
		toRemove.forEach(index => {
			//blocks[i].splice(index,1);
	
		});
	}
}


var interval = setInterval(function(){moveBlocks();}, 100);
var keyPressed = [false,false,false,false];

function play_music(i)
{
    if (!keyPressed[i - 49]){
        markers[i - 49].style("visibility", "visible");
        keyPressed[i - 49] = true;

        var j = 0;
        for (j = 0; j < blocks[i - 49].length; j++){
            var note = notes[i - 49][j];
            var x = parseInt(blocks[i - 49][j].attr('x'));
            var width = parseInt(blocks[i - 49][j].attr('width'));

            if (x <= 0 && x + width > 0){
                synths[0].triggerAttackRelease(note.name, (width - x) / 100);
            }
        }
    }
}

//$(document).keydown(function(e){
//    if ((e.which >= 49) && (e.which <= 52))
//	    play_music(e.which);
//});

function stop_music(i)
{
    markers[i - 49].style("visibility", "hidden");
    keyPressed[i - 49] = false;
}

//$(document).keyup(function(e){
//    if ((e.which >= 49) && (e.which <= 52))
//	    stop_music(e.which);
//});