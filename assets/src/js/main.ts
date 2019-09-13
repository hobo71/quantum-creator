import globals from './globals';

const { $ } = globals.variables;

$(document).ready(() => {
	$('#start-icon').attr(
		'src',
		globals.variables.path.join(process.cwd(), 'build/icon.png')
	);
	globals.elements.$newProjectModal.modal();
});

// Select folder for new project button click
globals.elements.$newProjectSelectFolderBtn.click(() => {
	let newProjectPath = globals.variables.electronRemote.dialog.showOpenDialog(
		{
			properties: ['openDirectory'],
		}
	)[0];

	globals.elements.$newProjectPathInput.val(newProjectPath);
});

globals.elements.$createNewProjectBtn.click(() => {
	let newProjectName = globals.elements.$newProjectNameInput.val();
	let newProjectPath = globals.elements.$newProjectPathInput.val();

	if (newProjectName != '') {
		if (newProjectPath != '') {
			globals.elements.$closeProjectBtn.click();
		} else {
			globals.functions.showDialog(
				'error',
				'Invalid Input',
				'Path input is empty.'
			);
		}
	} else {
		globals.functions.showDialog(
			'error',
			'Invalid Input',
			'Name of project is empty.'
		);
	}
});
