(() => {
	const origin = window.location.origin;
	const scriptCodeSnippet = `
&lt;!-- Add the following script tag to your page -->

&lt;script src="${origin}/kbs.js"
	data-server-url="${origin}/collect">
&lt;/script>
`;
	document.getElementById('scriptCodeSnippet').innerHTML = scriptCodeSnippet;

	const pageExampleCodeSnippet = `
&lt;!-- Full page example -->

&lt;!DOCTYPE html>
&lt;html lang="en">
&lt;head>
    &lt;meta charset="UTF-8">
    &lt;title>My Website To Track&lt;/title>
    &lt;script src="http://localhost:3000/kbs.js"
		data-server-url="http://localhost:3000/collect">
    &lt;/script>
    ...
&lt;/head>
&lt;body>
    &lt;h1>My Website Header&lt;/h1>
    &lt;main>My Website Main Content&lt;/main>
...
&lt;/body>
&lt;/html>
`;
	document.getElementById('pageExampleCodeSnippet').innerHTML = pageExampleCodeSnippet;
})();