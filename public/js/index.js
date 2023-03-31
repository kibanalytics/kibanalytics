(() => {
	const origin = window.location.origin;
	const scriptCodeSnippet = `
&lt;!-- Add the following script tag to your page -->

&lt;script src="${origin}/kbs.js">&lt;/script>`;
	document.getElementById('scriptCodeSnippet').innerHTML = scriptCodeSnippet;
})();