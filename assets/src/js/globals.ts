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

const createHTML = require('create-html');

require('betterial');

const electronRemote = require('electron').remote;

const path = require('path');

// jQuery Elements
let $newProjectBtn = $('#new-project-btn') as JQuery;
let $openProjectBtn = $('#open-project-btn') as JQuery;
let $closeProjectBtn = $("a[href='#new-project-modal'].modal-close") as JQuery;

let $newProjectSelectFolderBtn = $('#new-project-select-folder-btn') as JQuery;
let $createNewProjectBtn = $('a#create-new-project-btn') as JQuery;

let $newProjectNameInput = $('input#new-project-name-input') as JQuery;
let $newProjectPathInput = $('input#new-project-path-input') as JQuery;

let $newProjectModal = $('.modal#new-project-modal') as any;

// Global Functions

/**
 * Displays any type of dialog in the current window.
 *
 * @param title Title of dialog
 * @param message Message displayed dialog
 * @param type Type of message box: ['info', 'error', 'question', 'warning']
 */
function showDialog(type: String, title: String, message: String) {
	electronRemote.dialog.showMessageBox(electronRemote.getCurrentWindow(), {
		type: type,
		title: title,
		message: message,
	});
}

/**
 * Removes spaces from string and converts it to lowercase
 *
 * @param text Text to convert into a unix string.
 */

function toUNIX(text: string): String {
	return text.toLowerCase().replace(/ /g, '-');
}

const globals = {
	variables: {
		$,
		fse,
		grapesjs,
		anime,
		parser,
		createHTML,
		electronRemote,
		path,
	},
	elements: {
		$newProjectBtn,
		$openProjectBtn,
		$closeProjectBtn,
		$newProjectSelectFolderBtn,
		$createNewProjectBtn,
		$newProjectNameInput,
		$newProjectPathInput,
		$newProjectModal,
	},
	functions: {
		showDialog,
		toUNIX,
	},
};

export default globals;
