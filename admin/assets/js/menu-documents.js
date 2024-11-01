/**
 * This file is used to render the Markdown content in the editor render section.
 *
 * @package ultimate-markdown-pro
 */

jQuery( document ).ready(
	function ($) {

		'use strict';

		// Render the Markdown content based on the textarea value.
		const content = $( '#content' );
		if (content.length > 0) {
			const textareaValue = content.val();
			renderMarkdown( textareaValue );
		}

		// Render the Markdown text in the render section on the input event of the textarea.
		$( '#content' ).on(
			'input',
			function () {

				'use strict';

				const textareaValue = $( this ).val();
				renderMarkdown( textareaValue );

			}
		);

		// Render the Markdown text in the editor render.
		function renderMarkdown(textareaValue) {

			'use strict';

			/**
			 * Remove the YAML data available at the beginning of the document (Front
			 * Matter)
			 */
			const textWithoutFrontMatter = textareaValue.replace( /-{3}.+?-{3}/ms, '' );

			// Generate the HTML from the Markdown content.
			const content = marked( textWithoutFrontMatter );

			// Sanitize the generated HTML.
			let cleanContent = DOMPurify.sanitize(
				content,
				{USE_PROFILES: {html: true}}
			);

			// Add the HTML in the DOM.
			$( '#editor-render' ).html( cleanContent );

		}

	}
);