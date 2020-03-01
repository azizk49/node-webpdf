/* ----------  Imports  ---------- */

const puppeteer = require('puppeteer');
const process = require('process');
const path = require('path');
const chalk = require('chalk');
const readlineAsync = require('readline-sync');
const { map, isEmpty } = require('lodash');

/* ----------  Create PDF  ---------- */

const PDF = {
	create: async () => {
		const formats = ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'Letter', 'Legal', 'Tabloid', 'Ledger'];

		const fileName = readlineAsync.question('File Name: ');
		const url = readlineAsync.question('URL: ');
		const formatIndex = readlineAsync.keyInSelect(formats, 'Select Format (Default A4): ');
		const vMargin = readlineAsync.questionInt('Vertical Margins: ');
		const hMargin = readlineAsync.questionInt('Horizontal Margins: ');

		if(isEmpty(fileName)) {
			console.log(chalk.red('Please provide a valid file name.'));
			process.exit(1);
		}
		
		if(isEmpty(url)) {
			console.log(chalk.red('Please provide a valid URL.'));
			process.exit(1);
		}
		
		console.log('PDF Exporting Started...');

		const pdfPath = path.join(__dirname, 'pdf', `${ fileName }.pdf`);

		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		const options = {
			path: pdfPath,
			format: formats[formatIndex] || formats[4],
			printBackground: true,
			margin: {
				top: vMargin || 0,
				right: hMargin || 0,
				bottom: vMargin || 0,
				left: hMargin || 0,
			}
		}

		await page.goto(url, {
			waitUntil: 'networkidle2'
		});

		await page.pdf(options);

		await browser.close();

		console.log('PDF Exporting Finished!');
		console.log(chalk.green('PDF Exported at: ', chalk.bold(pdfPath)));
		process.exit(0);
	}
}

/* ----------  Execution  ---------- */

PDF.create();