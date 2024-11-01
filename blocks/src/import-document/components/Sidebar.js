/**
 * This file is used to create the "Import Document" editor sidebar section.
 *
 * @package ultimate-markdown
 */

const {PluginDocumentSettingPanel} = wp.editPost;
const {Component} = wp.element;
const {__} = wp.i18n;
const {FormFileUpload} = wp.components;
import {updateFields} from '../../utils';

export default class Sidebar extends Component {
    render() {

        return (
            <PluginDocumentSettingPanel
                name="daextulma-import-document"
                title={__('Import Markdown', 'ultimate-markdown')}
            >
                <FormFileUpload
                    className="block-library-gallery-add-item-button"
                    onChange={() => {

                        // Store the data of all the uploaded files.
                        const files = event.target.files;

                        // Store the data of the first uploaded file.cd
                        const file = files[0];

                        // Send ajax request.
                        const data = new FormData();
                        data.append('action', 'daextulma_import_document');
                        data.append('security', window.DAEXTULMA_PARAMETERS.nonce);
                        data.append('uploaded_file', file);

                        fetch(window.DAEXTULMA_PARAMETERS.ajaxUrl, {
                            method: 'POST',
                            body: data,
                        }).then(function (response) {

                            return response.json();

                        }).then(function (data) {

                            // Convert the Markdown text to HTML.
                            let pageHtml = marked(data['content']);

                            // Sanitize the generated HTML.
                            pageHtml = DOMPurify.sanitize(pageHtml,
                                {USE_PROFILES: {html: true}});

                            /**
                             * Delete the content of the post.
                             * See: https://wordpress.stackexchange.com/questions/305932/gutenberg-remove-add-blocks-with-custom-script
                             */
                            wp.data.dispatch('core/block-editor').resetBlocks([]);

                            // Generate the blocks from the HTML.
                            const blocks = wp.blocks.rawHandler(
                                {HTML: pageHtml},
                            );

                            // Update the editor fields.
                            updateFields(blocks, data);

                        });

                    }}
                    accept=".md,.markdown,.mdown,.mkdn,.mkd,.mdwn,.mdtxt,.mdtext,.text,.txt"
                    icon="insert"
                >
                    {__('Upload file and import', 'ultimate-markdown')}
                </FormFileUpload>
            </PluginDocumentSettingPanel>
        );
    }
}