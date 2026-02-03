const presetsPreviewDiv = document.getElementById('presets-preview');
const STORAGE_PRESETS = 'ascii-tool-presets';

const renderPresetsPreview = () => {
	presetsPreviewDiv.innerHTML = '';
	const presets = JSON.parse(localStorage.getItem(STORAGE_PRESETS) || '[]');
	presets.forEach((preset, index) => {
		const presetDiv = document.createElement('div');
		presetDiv.style.display = 'inline-block';
		presetDiv.style.width = preset.width;
		presetDiv.style.height = preset.height;
		presetDiv.style.overflow = 'hidden';
		presetDiv.style.border = `1px solid ${preset.textColor}`;
		presetDiv.style.marginRight = '10px';
		presetDiv.style.borderRadius = '4px';
		presetDiv.style.fontSize = '1.2em';
		presetDiv.style.margin = 0;
		presetDiv.title = preset.name;
		const presetPre = document.createElement('pre');
		presetPre.style.margin = '0';
		presetPre.style.height = '100%';
		presetPre.style.color = preset.textColor;
		presetPre.style.backgroundColor = preset.bgColor;
		presetPre.innerText = preset.text;
		presetDiv.appendChild(presetPre);
		presetsPreviewDiv.appendChild(presetDiv);
	});
}

renderPresetsPreview()