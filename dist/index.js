let fontListView = document.querySelector('.slds_sdk-ic-background-rw-2')
// let maxHeightVal = fontListView.offsetHeight
// let maxHeightUnit = 'px'
// let maxHeight = `${maxHeightVal}${maxHeightUnit}` 
// fontListView.style.maxHeight = `${maxHeightVal}${maxHeightUnit}`
// console.log(`${maxHeightVal}${maxHeightUnit}`); 
fontListView.style.overflow = 'scroll'; 

const sdk = new window.sfdc.BlockSDK()
let apiLimit
let var_uniqVal

function _debounce(func, wait, immediate) {
	let timeout
	return function() {
		let context = this, args = arguments
		let later = function() {
			timeout = null
			if (!immediate) func.apply(context, args)
		}
		let callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) func.apply(context, args)
	};
}

function _settings() {
  document.getElementById('apiLimit').value = apiLimit
  document.getElementById('bgUrl').value = bgUrl
  document.getElementById('bgText').value = bgText
  document.getElementById('bgTextColor').value = bgTextColor
  document.getElementById('bgTextBgColor').value = bgTextBgColor
  document.getElementById('bgWidth').value = bgWidth
  document.getElementById('bgHeight').value = bgHeight
  document.getElementById(var_uniqVal).checked = true
}

function _display() {
  let currentVal = apiLimit
  apiLimit = document.getElementById('apiLimit').value
  bgUrl = document.getElementById('bgUrl').value
  bgText = document.getElementById('bgText').value
  bgTextColor = document.getElementById('bgTextColor').value
  bgTextBgColor = document.getElementById('bgTextBgColor').value
  bgWidth = document.getElementById('bgWidth').value
  bgHeight = document.getElementById('bgHeight').value
  var_uniqVal = document.querySelector('input[name="ic-custom"]:checked').value

  if(document.querySelector('input[name="ic-custom"]:checked')) { 
    googleFontFamily = document.querySelector('input[name="ic-custom"]:checked').getAttribute('data-value')

    document.querySelector('.selectedFont').innerHTML = googleFontFamily
    document.querySelector('.selectedFont').style.fontFamily = googleFontFamily.replace(/ /g, '+')

    if(googleFontFamily == 'default') {
      googleFontStack = ''
      googleFontsCSS = ''
    } else {
      googleFontStack = `font-family:${googleFontFamily};`
      googleFontsCSS = `
        <!--[if !mso]><!-->
          <style>
            @import url('https://fonts.googleapis.com/css?family=${googleFontFamily}');
          </style>
        <!--<![endif]-->
      `
    } 
  }

  if(apiLimit != currentVal) {

    fetch(`https://googly-fonts-api.herokuapp.com/?limit=${apiLimit}`)
    .then((response) => response.json())
    .then((results) => {
      _createElements(results) 
    });

  }
  
  sdk.setContent(
    `
    ${googleFontsCSS}
        <div style="display:table; width:100%; max-width:${bgWidth}px; background-image:url('${bgUrl}'); background-size: cover; text-align: center; color: ${bgTextColor};">
          <div style="display:inline-block; width:0; vertical-align:middle; padding-bottom:${bgHeight / bgWidth * 100}%;"></div>
          <div style="display:inline-block; width:100%; background:${bgTextBgColor}; ${googleFontStack}">${bgText}</div>
        </div>
    `
  );
    
  sdk.setData({
    apiLimit,
    bgUrl,
    bgText,
    bgTextColor,
    bgTextBgColor,
    bgWidth,
    bgHeight,
    var_uniqVal,
  });

}

function _ui(apiData){
  
  let markup = ``
  apiData.forEach(element => {

   markup += `
      <span class="slds-radio">
        <input type="radio" value="${element.replace(/ /g, '+')}" id="${element.replace(/ /g, '+')}" name="ic-custom" data-value="${element}" ${var_uniqVal === element.replace(/ /g, '+')  ? 'checked' : ''} />
        <label class="slds-radio__label" for="${element.replace(/ /g, '+')}" style="font-family: ${element};">
          <span class="slds-radio_faux"></span>
          <span class="slds-form-element__label">${element}</span>
        </label>
      </span>
    `    
  });
  markup += `
    <span class="slds-radio">
      <input type="radio" value="default" id="default" data-value="default" name="ic-custom" ${var_uniqVal === 'default'  ? 'checked' : ''}/>
      <label class="slds-radio__label" for="default" style="">
        <span class="slds-radio_faux"></span>
        <span class="slds-form-element__label">Default</span>
      </label>
    </span>
  `
  return markup
}

function _createElements(results) {
  document.getElementById('external').setAttribute(
    'href', `https://fonts.googleapis.com/css?family=${results.map(el => el.replace(/ /g, '+')).join('|')}`
  )

  document.querySelector('.sfmc-sdk-custom__inputs').innerHTML = _ui(results)
}

sdk.getData((data) => {
  apiLimit = data.apiLimit || 2
  bgUrl = data.bgUrl || 'https://placekitten.com/g/400/300'
  bgText = data.bgText || 'think globally'
  bgTextColor = data.bgTextColor || '#000000'
  bgTextBgColor = data.bgTextBgColor || '#ffffff'
  bgWidth = data.bgWidth || '400'
  bgHeight = data.bgHeight || '300'
  var_uniqVal = data.var_uniqVal || 'default'
  fetch(`https://googly-fonts-api.herokuapp.com/?limit=${apiLimit}`)
  .then((response) => response.json())
  .then((results) => {
    _createElements(results)
    _settings()
    _display()    
  });

});

document.getElementById('blockSDK').addEventListener('input', () => {
	_debounce(_display, 500)()
});
