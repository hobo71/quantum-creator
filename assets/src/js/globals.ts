let globals = {
	variables: {},
	elements: {},
	functions: {},
};

// Global Variables And Libraries
const $ = require('jquery');
const jQuery = require('jquery');

// @ts-ignore
window.$ = window.jQuery = $;

const fse = require('fs-extra');
const grapesjs = require('grapesjs');

const anime = require('animejs');
// @ts-ignore
window.anime = anime;

const parser = require('node-html-parser').parse;

const Waves = require('node-waves');
// @ts-ignore
window.Waves = Waves;
Waves.init();

require('betterial');

const electronRemote = require('electron').remote;

const path = require('path');

// Global variables
globals.variables = {
	$,
	jQuery,
	grapesjs,
	fse,
	anime,
	Waves,
	parser,
	electronRemote,
	path,
};

// jQuery Elements
let $newProjectBtn = $('#new-project-btn') as any;
let $openProjectBtn = $('#open-project-btn') as any;
let $newProjectSelectFolderBtn = $('#new-project-select-folder-btn') as any;
let $createNewProjectBtn = $('a#create-new-project-btn') as any;

let $newProjectNameInput = $('input#new-project-name-input') as any;
let $newProjectPathInput = $('input#new-project-path-input') as any;

let $newProjectModal = $('.modal#new-project-modal') as any;

// Global HTML Elements
globals.elements = {
	$newProjectBtn,
	$openProjectBtn,
	$newProjectSelectFolderBtn,
	$createNewProjectBtn,
	$newProjectNameInput,
	$newProjectPathInput,
	$newProjectModal,
};

// Global Functions
function errorBox(title: String, message: String) {
	electronRemote.dialog.showMessageBox(electronRemote.getCurrentWindow(), {
		type: 'error',
		title: title,
		message: message,
	});
}

function toUNIX<String>(text: string) {
	return text
		.toString()
		.toLowerCase()
		.replace(/ /g, '-');
}

// Global JS Functions
globals.functions = {
	errorBox,
	toUNIX,
};

export default globals;
