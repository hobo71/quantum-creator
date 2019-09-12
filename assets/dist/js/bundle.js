'use strict';

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
let $newProjectBtn = $('#new-project-btn');
let $openProjectBtn = $('#open-project-btn');
let $closeProjectBtn = $("a[href='#new-project-modal'].modal-close");
let $newProjectSelectFolderBtn = $('#new-project-select-folder-btn');
let $createNewProjectBtn = $('a#create-new-project-btn');
let $newProjectNameInput = $('input#new-project-name-input');
let $newProjectPathInput = $('input#new-project-path-input');
let $newProjectModal = $('.modal#new-project-modal');
// Global Functions
/**
 * Displays any type of dialog in the current window.
 *
 * @param title Title of dialog
 * @param message Message displayed dialog
 * @param type Type of message box: ['info', 'error', 'question', 'warning']
 */
function showDialog(type, title, message) {
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
function toUNIX(text) {
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

const { $: $$1 } = globals.variables;
$$1(document).ready(() => {
    globals.elements.$newProjectModal.modal();
});
// Select folder for new project button click
globals.elements.$newProjectSelectFolderBtn.click(() => {
    let newProjectPath = globals.variables.electronRemote.dialog.showOpenDialog({
        properties: ['openDirectory'],
    })[0];
    globals.elements.$newProjectPathInput.val(newProjectPath);
});
globals.elements.$createNewProjectBtn.click(() => {
    let newProjectName = globals.elements.$newProjectNameInput.val();
    let newProjectPath = globals.elements.$newProjectPathInput.val();
    if (newProjectName != '') {
        if (newProjectPath != '') {
            globals.elements.$closeProjectBtn.click();
        }
        else {
            globals.functions.showDialog('error', 'Invalid Input', 'Path input is empty.');
        }
    }
    else {
        globals.functions.showDialog('error', 'Invalid Input', 'Name of project is empty.');
    }
});
