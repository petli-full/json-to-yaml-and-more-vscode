// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { openQueryBox } from './commands';
import { initServices } from './services';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "json-to-yaml-and-more" is now active!');

	context.subscriptions.push(
		// commands
		vscode.commands.registerCommand('json-to-yaml-and-more.open-query-box', openQueryBox),

		// services
		initServices(),
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }
