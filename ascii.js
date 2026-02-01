const imageInput = document.getElementById("image-input");
const imageContainer = document.querySelector('.image-container');
const asciiTextarea = document.getElementById('asci-textarea');
const asciiHighlight = document.getElementById('ascii-highlight');
const alphaSlider = document.getElementById('alpha-slider');
const charAlphaSlider = document.getElementById('char-alpha-slider');
const textColorPicker = document.getElementById('text-color-picker');
const bgColorPicker = document.getElementById('bg-color-picker');
const charBgColorPicker = document.getElementById('char-bg-color-picker');
const savePresetBtn = document.getElementById('save-preset');
const copyClipboardBtn = document.getElementById('copy-clipboard');
const invertColorsBtn = document.getElementById('invert-colors');
const exportPresetsBtn = document.getElementById('export-presets');
const importPresetsInput = document.getElementById('import-presets');
const importPresetsBtn = document.getElementById('import-presets-btn');
const presetsList = document.getElementById('presets-list');
const replaceTooltip = document.getElementById('replace-tooltip');
const replaceCharInput = document.getElementById('replace-char');
const replaceBtn = document.getElementById('replace-btn');
const undoReplaceBtn = document.getElementById('undo-replace-btn');
const toggleSettingsBtn = document.getElementById('toggle-settings');
const settingsDiv = document.getElementById('settings');
const backgroundPosSelect = document.getElementById('background-pos');
const loadFileBtn = document.getElementById('load-file-btn');
const newFileBtn = document.getElementById('new-file-btn');
const loadFileList = document.getElementById('load-file-list');
const loadFileListPre = document.getElementById('load-file-list-pre');

const asciiPresets = JSON.parse(localStorage.getItem('ascii-tool-presets') || ['[]']);

if (asciiPresets.length === 0) {
	const presets = JSON.parse(localStorage.getItem("ascii-tool-presets") || '[]');
	presets.push({
		"name": "white rabbit",
		"text": " \n          ^_\n         //\\\\    _^_\n         ||.\\\\  //.\\\\\n          \\\\.\\\\//..//\n          /*\\// \\..//\n        .* --/\\  \\//\n      .*      \\ . /\n    .*         \\)\n   /.   ._.     \\**_.*-----.__\n  (9)  (99)      )            *--\n  /\"     \"       )               *--\n  \\**        .__.                   *--\n   \\wWw   __/                          *-\n    *----*                                *_\n     \\                                      *\n      \\                        .---.         |\n      (  (     .      .       *     *        |                                                                                                                                                                                                                \n       \\  \\    \\     (      .*               |\n        7  7    7     \\    /                .*\n       /  //  /*-__.___\\(    ..            / /\n       wWW wWW          \\ /\\            /   /\n                         WWw\\   /     /    /\n                             WWW *_______/==\n ",
		"width": "403px",
		"height": "456px",
		"bgColor": "#ffffff",
		"textColor": "#000000",
		"backgroundPos": "",
		"backgroundOpacity": "0.5",
		"charBgOpacity": "0.5",
		"charBgColor": "#ffffff"
	});
	presets.push({
		"name": "is fast",
		"text": " \n          ^_\n         //\\\\    _^_\n         ||.\\\\  //.\\\\\n          \\\\.\\\\//..//\n          /*\\// \\..//\n        .* --/\\  \\//\n      .*      \\ . /\n    .*         \\)\n   /.   ._.     \\**_.*-----.__\n  (9)  (99)      )            *--\n  /\"     \"       )               *--\n  \\**        .__.                   *--\n   \\wWw   __/                          *-\n    *----*                                *_\n     \\                                      *\n      \\                        .---.         |\n      (  (     .      .       *     *        |                                                                                                                                                                                                                \n       \\  \\    \\     (      .*               |\n        7  7    7     \\    /                .*\n       /  //  /*-__.___\\(    ..            / /\n       wWW wWW          \\ /\\            /   /\n                         WWw\\   /     /    /\n                             WWW *_______/==\n ",
		"width": "403px",
		"height": "456px",
		"bgColor": "#000000",
		"textColor": "#04ff00",
		"backgroundPos": "",
		"backgroundOpacity": "1",
		"charBgOpacity": "0",
		"charBgColor": "#ffffff"
	});
	presets.push({
		"name": "and cute",
		"text": " \n          ^_\n         //\\\\    _^_\n         ||.\\\\  //.\\\\            <3\n          \\\\.\\\\//..//\n          /*\\// \\..//                  <3\n        .* --/\\  \\//\n      .*      \\ . /        <3\n    .*         \\)\n   /.   ._.     \\**_.*-----.__\n  (9)  (99)      )            *--\n  /\"     \"       )               *--\n  \\**        .__.                   *--\n   \\wWw   __/                          *-\n    *----*                                *_\n     \\                                      *\n      \\                        .---.         |\n      (  (     .      .       *     *        |                                                                                                                                                                                                                \n       \\  \\    \\     (      .*               |\n        7  7    7     \\    /                .*\n       /  //  /*-__.___\\(    ..            / /\n       wWW wWW          \\ /\\            /   /\n                         WWw\\   /     /    /\n                             WWW *_______/==\n ",
		"width": "403px",
		"height": "456px",
		"bgColor": "#ffffff",
		"textColor": "#e60ac9",
		"backgroundPos": "",
		"backgroundOpacity": "1",
		"charBgOpacity": "1",
		"charBgColor": "#ffffff"
	});
	localStorage.setItem("ascii-tool-presets", JSON.stringify(presets));
}

backgroundPosSelect.addEventListener('change', (ev) => {
	imageContainer.style.backgroundPosition = ev.target.value;
});

let undoText = null;

function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function invertHex(hex) {
	const rgb = hexToRgb(hex);
	if (rgb) {
		const invR = (255 - rgb.r).toString(16).padStart(2, '0');
		const invG = (255 - rgb.g).toString(16).padStart(2, '0');
		const invB = (255 - rgb.b).toString(16).padStart(2, '0');
		return `#${invR}${invG}${invB}`;
	}
	return hex;
}


function renderAsciiButtons() {
	const buttons = document.querySelectorAll('button');
	buttons.forEach((button) => {
		if (button.textContent.startsWith('+')) {
			return;
		}
		const buttonText = button.textContent;
		const pre = document.createElement('pre');
		const buttonCharWidth = button.textContent.length
		button.textContent = '';
		button.classList.add('ascii-button');
		pre.innerHTML = `<span class="ascii-button-span-start">+${'-'.repeat(buttonCharWidth + 2)}+
|</span> ${buttonText} <span class="ascii-button-span-end">|
+${'-'.repeat(buttonCharWidth + 2)}+</span>`;
		button.appendChild(pre);
	});

}

function renderPresetsList() {
	presetsList.innerHTML = '';
	const presets = JSON.parse(localStorage.getItem(STORAGE_PRESETS) || '[]');

	presets.forEach((preset, index) => {
		const div = document.createElement('div');
		div.style.display = 'flex';
		div.style.alignItems = 'center';
		div.style.marginBottom = '5px';

		const nameSpan = document.createElement('span');
		nameSpan.textContent = preset.name;
		nameSpan.style.flexGrow = '1';

		const loadBtn = document.createElement('button');
		loadBtn.textContent = 'Load';
		loadBtn.addEventListener('click', () => loadPreset(index));

		const exportBtn = document.createElement('button');
		exportBtn.textContent = 'Export';
		exportBtn.style.marginLeft = '10px';
		exportBtn.addEventListener('click', () => exportPreset(index));

		const deleteBtn = document.createElement('button');
		deleteBtn.textContent = 'Delete';
		deleteBtn.style.marginLeft = '10px';
		deleteBtn.addEventListener('click', () => deletePreset(index));

		div.appendChild(nameSpan);
		div.appendChild(loadBtn);
		div.appendChild(exportBtn);
		div.appendChild(deleteBtn);
		presetsList.appendChild(div);

		renderAsciiButtons();
	});
}

function deletePreset(index) {
	const presets = JSON.parse(localStorage.getItem(STORAGE_PRESETS) || '[]');
	if (confirm(`Delete preset "${presets[index].name}"?`)) {
		presets.splice(index, 1);
		localStorage.setItem(STORAGE_PRESETS, JSON.stringify(presets));
		renderPresetsList();
	}
}

function exportPreset(index) {
	const presets = JSON.parse(localStorage.getItem(STORAGE_PRESETS) || '[]');
	if (presets[index]) {
		const preset = presets[index];
		const blob = new Blob([JSON.stringify([preset])], { type: 'application/json' });
		const link = document.createElement('a');
		link.download = `${preset.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-preset.json`;
		link.href = URL.createObjectURL(blob);
		link.click();
	}
}

function loadPreset(index) {
	const presets = JSON.parse(localStorage.getItem(STORAGE_PRESETS) || '[]');
	if (presets[index]) {
		const preset = presets[index];
		const bgRgb = hexToRgb(preset.bgColor);

		asciiTextarea.value = preset.text;
		bgColorPicker.value = preset.bgColor;
		textColorPicker.value = preset.textColor;
		asciiHighlight.innerHTML = preset.text.replace(/./g, '<span class="char-bg">$&</span>');

		imageContainer.style.width = preset.width;
		imageContainer.style.height = preset.height;
		imageContainer.style.backgroundPosition = preset.backgroundPos || 'center';
		backgroundPosSelect.value = preset.backgroundPos || 'center';
		charBgColorPicker.value = preset.charBgColor || '#ffffff';
		const charBgRgb = hexToRgb(preset.charBgColor || '#ffffff');
		document.documentElement.style.setProperty('--char-bg-r', charBgRgb.r);
		document.documentElement.style.setProperty('--char-bg-g', charBgRgb.g);
		document.documentElement.style.setProperty('--char-bg-b', charBgRgb.b);

		alphaSlider.value = preset.backgroundOpacity || 0.5;
		document.documentElement.style.setProperty('--alpha', preset.backgroundOpacity || 0.5);
		charAlphaSlider.value = preset.charBgOpacity || 0.5;
		document.documentElement.style.setProperty('--char-alpha', preset.charBgOpacity || 0.5);

		document.documentElement.style.setProperty('--bg-r', bgRgb.r);
		document.documentElement.style.setProperty('--bg-g', bgRgb.g);
		document.documentElement.style.setProperty('--bg-b', bgRgb.b);
		document.documentElement.style.setProperty('--text-color', textColorPicker.value);

		localStorage.setItem(STORAGE_TEXT, preset.text);
		localStorage.setItem(STORAGE_BG_COLOR, preset.bgColor);
		localStorage.setItem(STORAGE_TEXT_COLOR, preset.textColor);
	}
}

const STORAGE_IMAGE = 'ascii-tool-image';
const STORAGE_WIDTH = 'ascii-tool-width';
const STORAGE_HEIGHT = 'ascii-tool-height';
const STORAGE_TEXT = 'ascii-tool-text';
const STORAGE_ALPHA = 'ascii-tool-alpha';
const STORAGE_CHAR_ALPHA = 'ascii-tool-char-alpha';
const STORAGE_TEXT_COLOR = 'ascii-tool-text-color';
const STORAGE_BG_COLOR = 'ascii-tool-bg-color';
const STORAGE_CHAR_BG_COLOR = 'ascii-tool-char-bg-color';
const STORAGE_PRESETS = 'ascii-tool-presets';

const savedImage = localStorage.getItem(STORAGE_IMAGE);
if (savedImage) {
	imageContainer.style.backgroundImage = `url('${savedImage}')`;
}

const savedWidth = localStorage.getItem(STORAGE_WIDTH);
const savedHeight = localStorage.getItem(STORAGE_HEIGHT);
if (savedWidth && savedHeight) {
	imageContainer.style.width = savedWidth;
	imageContainer.style.height = savedHeight;
}

const savedText = localStorage.getItem(STORAGE_TEXT);
if (savedText) {
	asciiTextarea.value = savedText;
	asciiHighlight.innerHTML = savedText.replace(/./g, '<span class="char-bg">$&</span>');
}

const savedAlpha = localStorage.getItem(STORAGE_ALPHA) || 0.5;
document.documentElement.style.setProperty('--alpha', savedAlpha);
alphaSlider.value = savedAlpha;

const savedCharAlpha = localStorage.getItem(STORAGE_CHAR_ALPHA) || 0.5;
document.documentElement.style.setProperty('--char-alpha', savedCharAlpha);
charAlphaSlider.value = savedCharAlpha;

const savedTextColor = localStorage.getItem(STORAGE_TEXT_COLOR) || '#000000';
document.documentElement.style.setProperty('--text-color', savedTextColor);
textColorPicker.value = savedTextColor;

const savedBgColor = localStorage.getItem(STORAGE_BG_COLOR) || '#ffffff';
const bgRgb = hexToRgb(savedBgColor);
document.documentElement.style.setProperty('--bg-r', bgRgb.r);
document.documentElement.style.setProperty('--bg-g', bgRgb.g);
document.documentElement.style.setProperty('--bg-b', bgRgb.b);
bgColorPicker.value = savedBgColor;

const savedCharBgColor = localStorage.getItem(STORAGE_CHAR_BG_COLOR) || '#ffffff';
const charBgRgb = hexToRgb(savedCharBgColor);
document.documentElement.style.setProperty('--char-bg-r', charBgRgb.r);
document.documentElement.style.setProperty('--char-bg-g', charBgRgb.g);
document.documentElement.style.setProperty('--char-bg-b', charBgRgb.b);
charBgColorPicker.value = savedCharBgColor;

renderPresetsList();

savePresetBtn.addEventListener('click', () => {
	const name = prompt('Enter preset name:');
	if (name) {
		const presets = JSON.parse(localStorage.getItem(STORAGE_PRESETS) || '[]');
		presets.push({
			name: name,
			text: asciiTextarea.value,
			width: imageContainer.style.width,
			height: imageContainer.style.height,
			bgColor: bgColorPicker.value,
			textColor: textColorPicker.value,
			backgroundPos: backgroundPosSelect.value,
			backgroundOpacity: alphaSlider.value,
			charBgOpacity: charAlphaSlider.value,
			charBgColor: charBgColorPicker.value
		});
		localStorage.setItem(STORAGE_PRESETS, JSON.stringify(presets));
		renderPresetsList();
		alert(`Preset "${name}" saved!`);
	}
});

copyClipboardBtn.addEventListener('click', async () => {
	try {
		await navigator.clipboard.writeText(asciiTextarea.value);
		alert('Copied to clipboard!');
	} catch (err) {
		alert('Failed to copy: ' + err);
	}
});

invertColorsBtn.addEventListener('click', () => {
	const invertedTextColor = invertHex(textColorPicker.value);
	textColorPicker.value = invertedTextColor;
	document.documentElement.style.setProperty('--text-color', invertedTextColor);
	localStorage.setItem(STORAGE_TEXT_COLOR, invertedTextColor);

	const invertedBgColor = invertHex(bgColorPicker.value);
	bgColorPicker.value = invertedBgColor;
	const bgRgb = hexToRgb(invertedBgColor);
	document.documentElement.style.setProperty('--bg-r', bgRgb.r);
	document.documentElement.style.setProperty('--bg-g', bgRgb.g);
	document.documentElement.style.setProperty('--bg-b', bgRgb.b);
	localStorage.setItem(STORAGE_BG_COLOR, invertedBgColor);

	const invertedCharBgColor = invertHex(charBgColorPicker.value);
	charBgColorPicker.value = invertedCharBgColor;
	const charBgRgb = hexToRgb(invertedCharBgColor);
	document.documentElement.style.setProperty('--char-bg-r', charBgRgb.r);
	document.documentElement.style.setProperty('--char-bg-g', charBgRgb.g);
	document.documentElement.style.setProperty('--char-bg-b', charBgRgb.b);
	localStorage.setItem(STORAGE_CHAR_BG_COLOR, invertedCharBgColor);
});

exportPresetsBtn.addEventListener('click', () => {
	const presets = localStorage.getItem(STORAGE_PRESETS) || '[]';
	const blob = new Blob([presets], { type: 'application/json' });
	const link = document.createElement('a');
	link.download = 'ascii-presets.json';
	link.href = URL.createObjectURL(blob);
	link.click();
});

importPresetsBtn.addEventListener('click', () => {
	importPresetsInput.click();
});

importPresetsInput.addEventListener('change', (event) => {
	const file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const importedPresets = JSON.parse(e.target.result);
				if (Array.isArray(importedPresets)) {
					const currentPresets = JSON.parse(localStorage.getItem(STORAGE_PRESETS) || '[]');
					const mergedPresets = currentPresets.concat(importedPresets);
					localStorage.setItem(STORAGE_PRESETS, JSON.stringify(mergedPresets));
					renderPresetsList();
					alert('Presets imported and added successfully!');
				} else {
					alert('Invalid presets file.');
				}
			} catch (err) {
				alert('Error parsing presets file: ' + err);
			}
		};
		reader.readAsText(file);
	}
});
toggleSettingsBtn.addEventListener('click', () => {
	if (settingsDiv.style.display === 'none') {
		settingsDiv.style.display = 'block';
		toggleSettingsBtn.textContent = 'Hide Options';
	} else {
		settingsDiv.style.display = 'none';
		toggleSettingsBtn.textContent = 'Show Options';
	}
	renderAsciiButtons()

});
const resizeObserver = new ResizeObserver(entries => {
	for (let entry of entries) {
		const { width, height } = entry.contentRect;
		localStorage.setItem(STORAGE_WIDTH, width + 'px');
		localStorage.setItem(STORAGE_HEIGHT, height + 'px');
	}
});
resizeObserver.observe(imageContainer);

alphaSlider.addEventListener('input', () => {
	document.documentElement.style.setProperty('--alpha', alphaSlider.value);
	localStorage.setItem(STORAGE_ALPHA, alphaSlider.value);
});

charAlphaSlider.addEventListener('input', () => {
	document.documentElement.style.setProperty('--char-alpha', charAlphaSlider.value);
	localStorage.setItem(STORAGE_CHAR_ALPHA, charAlphaSlider.value);
});

textColorPicker.addEventListener('input', () => {
	document.documentElement.style.setProperty('--text-color', textColorPicker.value);
	localStorage.setItem(STORAGE_TEXT_COLOR, textColorPicker.value);
});

bgColorPicker.addEventListener('input', () => {
	const rgb = hexToRgb(bgColorPicker.value);
	document.documentElement.style.setProperty('--bg-r', rgb.r);
	document.documentElement.style.setProperty('--bg-g', rgb.g);
	document.documentElement.style.setProperty('--bg-b', rgb.b);
	localStorage.setItem(STORAGE_BG_COLOR, bgColorPicker.value);
});

charBgColorPicker.addEventListener('input', () => {
	const rgb = hexToRgb(charBgColorPicker.value);
	document.documentElement.style.setProperty('--char-bg-r', rgb.r);
	document.documentElement.style.setProperty('--char-bg-g', rgb.g);
	document.documentElement.style.setProperty('--char-bg-b', rgb.b);
	localStorage.setItem(STORAGE_CHAR_BG_COLOR, charBgColorPicker.value);
});

// Piró el copilot aca jajaja que mierda hizo

// asciiTextarea.value = `  ___    ____  __  __ ___ _   _ _____ ____ 
//  / _ \\  |  _ \\|  \\/  |_ _| \\ | |_   _|  _ \\
// | | | | | |_) | |\\/| || ||  \\| | | | | |_) |
// | |_| | |  __/| |  | || || |\\  | | | |  __/
//  \\___/  |_|   |_|  |_|___|_| \\_| |_| |_|_|
// `;

if (imageInput && imageContainer) {
	imageInput.addEventListener('change', function (e) {
		const file = imageInput.files && imageInput.files[0];
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = function (ev) {
				imageContainer.style.backgroundImage = `url('${ev.target.result}')`;
				localStorage.setItem(STORAGE_IMAGE, ev.target.result);
			};
			reader.readAsDataURL(file);
		}
	});
}

if (asciiTextarea) {
	asciiTextarea.addEventListener('input', function () {
		asciiHighlight.innerHTML = asciiTextarea.value.replace(/./g, '<span class="char-bg">$&</span>');
		localStorage.setItem(STORAGE_TEXT, asciiTextarea.value);
	});

	// Replace button
	// replaceBtn.addEventListener('click', () => {
	// 	const char = replaceCharInput.value;
	// 	if (char && asciiTextarea.selectionStart !== asciiTextarea.selectionEnd) {
	// 		undoText = asciiTextarea.value;
	// 		const start = asciiTextarea.selectionStart;
	// 		const end = asciiTextarea.selectionEnd;
	// 		const length = end - start;
	// 		const replacement = char.repeat(length);
	// 		asciiTextarea.value = asciiTextarea.value.substring(0, start) + replacement + asciiTextarea.value.substring(end);
	// 		asciiTextarea.selectionStart = asciiTextarea.selectionEnd = start + length;
	// 		asciiHighlight.innerHTML = asciiTextarea.value.replace(/./g, '<span class="char-bg">$&</span>');
	// 		localStorage.setItem(STORAGE_TEXT, asciiTextarea.value);
	// 		replaceCharInput.value = '';
	// 	}
	// });

	// Undo replace button
	// undoReplaceBtn.addEventListener('click', () => {
	// 	if (undoText !== null) {
	// 		asciiTextarea.value = undoText;
	// 		asciiHighlight.innerHTML = undoText.replace(/./g, '<span class="char-bg">$&</span>');
	// 		localStorage.setItem(STORAGE_TEXT, undoText);
	// 		undoText = null;
	// 	}
	// });
}

newFileBtn.addEventListener('click', () => {
	if (confirm('Create a new file? Unsaved changes will be lost.')) {
		asciiTextarea.value = '';
		asciiHighlight.innerHTML = '';
		// imageContainer.style.backgroundImage = 'none';
		localStorage.removeItem(STORAGE_IMAGE);
		localStorage.removeItem(STORAGE_TEXT);
	}
});

loadFileBtn.addEventListener('click', () => {
	loadFileList.style.display = loadFileList.style.display === 'block' ? 'none' : 'block';
	const presets = JSON.parse(localStorage.getItem(STORAGE_PRESETS) || '[]');
	loadFileListPre.textContent = '';
	presets.forEach((preset, index) => {
		const a = document.createElement('a');
		a.href = '#';
		a.textContent = `${preset.name} \n`;
		loadFileListPre.appendChild(a);
		a.addEventListener('click', () => {
			loadPreset(index);
			loadFileList.style.display = 'none';
		});
	});
});

renderAsciiButtons();

