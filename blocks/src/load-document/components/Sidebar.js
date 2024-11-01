/**
 * This file is used to create the "Load Markdown" editor sidebar section.
 *
 * @package ultimate-markdown
 */

const {dispatch, select} = wp.data;
const {PluginDocumentSettingPanel} = wp.editPost;
const {Component} = wp.element;
const {__} = wp.i18n;
const {Button, SelectControl} = wp.components;
import {updateFields} from '../../utils';

export default class Sidebar extends Component {

    constructor(props) {

        super(...arguments);

        // The state is only used to rerender the component with setState.
        this.state = {
            documentIdSelectorValue: '',
        };

    }

    render() {

        const meta = select('core/editor').getEditedPostAttribute('meta');
        const documentIdSelectorMeta = meta['_import_markdown_pro_load_document_selector'];

        return (
            <PluginDocumentSettingPanel
                name="daextulma-load-document"
                title={__('Load Markdown', 'ultimate-markdown')}
            >
                <SelectControl
                    label={__('Markdown document', 'ultimate-markdown')}
                    help={__(
                        'Select a Markdown document, then click the submit document button to generate the corresponding blocks.',
                        'ultimate-markdown')}
                    value={documentIdSelectorMeta}
                    onChange={(document_id) => {

                        dispatch('core/editor').editPost({
                            meta: {
                                '_import_markdown_pro_load_document_selector': document_id,
                            },
                        });

                        // Used to rerender the component.
                        this.setState({
                            documentIdSelectorValue: document_id,
                        });

                    }}
                    options={window.DAEXTULMA_PARAMETERS.documents}
                />

                <Button
                    variant="secondary"
                    className="editor-post-trash is-destructive"
                    onClick={() => {

                        // Send an AJAX request to retrieve the HTML of the selected markdown document ----------------.

                        // Get the meta value.
                        const meta = select('core/editor').getEditedPostAttribute('meta');
                        const document_id = meta['_import_markdown_pro_load_document_selector'];

                        // Do not proceed if the selected option is "Not set".
                        if (parseInt(document_id, 10) === 0) {
                            return;
                        }

                        // Send an AJAX request to retrieve the HTML of the selected document.
                        const data = new FormData();
                        data.append('action', 'daextulma_load_document');
                        data.append('security', window.DAEXTULMA_PARAMETERS.nonce);
                        data.append('document_id', document_id);

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
                             * Delete the content of the post (based on the related option).
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
                >{__('Submit document', 'ultimate-markdown')}</Button>

            </PluginDocumentSettingPanel>
        );
    }
}