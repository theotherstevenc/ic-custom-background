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

function _theBlock(){

  const sdk = new window.sfdc.BlockSDK()
  let limit = document.getElementById('quiet').value

  const endpoint = `https://googly-fonts-api.herokuapp.com/?limit=${limit}`;

  async function _getApiData() {
    try {
      let res = await fetch(endpoint)
      return await res.json()
    } catch (e) {
      console.log(e)
    }
  }

  async function _render() {

    let mockApiData = await _getApiData()

    document.getElementById('external').setAttribute(
      'href', `https://fonts.googleapis.com/css?family=${mockApiData.map(el => el.replace(/ /g, '+')).join('|')}`
    )

    function ui(mockApiData){
      let markup = ``
      mockApiData.forEach(element => {
        markup += `
          <span class="slds-radio">
            <input type="radio" value="${element.replace(/ /g, '+')}" id="${element.replace(/ /g, '+')}" name="ic-custom" data-value="${element}" />
            <label class="slds-radio__label" for="${element.replace(/ /g, '+')}" style="font-family: ${element}; font-size: 2em;">
              <span class="slds-radio_faux"></span>
              <span class="slds-form-element__label">${element}</span>
            </label>
          </span>
        `    
      });
      markup += `
        <span class="slds-radio">
          <input type="radio" value="default" id="default" name="ic-custom" />
          <label class="slds-radio__label" for="default" style="font-size: 2em;">
            <span class="slds-radio_faux"></span>
            <span class="slds-form-element__label">Default</span>
          </label>
        </span>
      `
      return markup
    }

    document.querySelector('.sfmc-sdk-custom__inputs').innerHTML = ui(mockApiData)

    function _settings() {
      document.getElementById('bgUrl').value = bgUrl
      document.getElementById('bgText').value = bgText
      document.getElementById('bgTextColor').value = bgTextColor
      document.getElementById('bgTextBgColor').value = bgTextBgColor
      document.getElementById('bgWidth').value = bgWidth
      document.getElementById('bgHeight').value = bgHeight
      document.getElementById(var_uniqVal).checked = true
      document.getElementById('quiet').value = fontObjs
    }

    function _display() {
      bgUrl = document.getElementById('bgUrl').value
      bgText = document.getElementById('bgText').value
      bgTextColor = document.getElementById('bgTextColor').value
      bgTextBgColor = document.getElementById('bgTextBgColor').value
      bgWidth = document.getElementById('bgWidth').value
      bgHeight = document.getElementById('bgHeight').value
      var_uniqVal = document.querySelector('input[name="ic-custom"]:checked').value
      fontObjs = document.getElementById('quiet').value

      if(document.querySelector('input[name="ic-custom"]:checked')) { 
        googleFontFamily = document.querySelector('input[name="ic-custom"]:checked').getAttribute('data-value')
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
        
      sdk.setContent(
        `
        ${googleFontsCSS}
        <div style="display:table; width:100%; max-width:${bgWidth}px; background-image:url('${bgUrl}'); background-size: cover; text-align: center; color: ${bgTextColor};">
          <div style="display:inline-block; width:0; vertical-align:middle; padding-bottom:${bgHeight / bgWidth * 100}%;"></div>
          <div style="display:inline-block; width:100%; font-size:22px; background:${bgTextBgColor}; ${googleFontStack}">${bgText}</div>
        </div>
        `
      );
        
      sdk.setData({
        bgUrl,
        bgText,
        bgTextColor,
        bgTextBgColor,
        bgWidth,
        bgHeight,
        var_uniqVal,
        fontObjs,
      });
    }

    sdk.getData((data) => {
      bgUrl = data.bgUrl || 'https://placekitten.com/g/400/300'
      bgText = data.bgText || 'think globally'
      bgTextColor = data.bgTextColor || '#000000'
      bgTextBgColor = data.bgTextBgColor || '#ffffff'
      bgWidth = data.bgWidth || '400'
      bgHeight = data.bgHeight || '300'
      var_uniqVal = data.var_uniqVal || 'default'
      fontObjs = data.fontObjs || 3
      _settings()
      _display()
    });

    document.getElementById('blockSDK').addEventListener('input', () => {
      _debounce(_display, 500)()
      _debounce(_theBlock, 500)()
    });

  }

  _render()

}

_theBlock()
