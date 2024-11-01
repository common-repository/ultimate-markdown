/**
 * This file is used to create the "Submit Markdown" editor sidebar section.
 *
 * @package ultimate-markdown
 */

const {Button, TextareaControl} = wp.components;
const {dispatch, select} = wp.data;
const {PluginDocumentSettingPanel} = wp.editPost;
const {Component} = wp.element;
const {__} = wp.i18n;
import {updateFields} from '../../utils';

export default class Sidebar extends Component {

    constructor(props) {

        super(...arguments);

        // The state is used only to rerender the component with setState.
        this.state = {
            textareaValue: '',
        };

    }

    render() {

        const meta = select('core/editor').getEditedPostAttribute('meta');
        const markdownText = meta['_import_markdown_pro_submit_text_textarea'];

        return (
            <PluginDocumentSettingPanel
                name="submit-text"
                title={__('Submit Markdown', 'ultimate-markdown')}
            >


                <TextareaControl
                    label={__('Markdown text', 'ultimate-markdown')}
                    help={__(
                        'Enter the Markdown text, then click the submit text button to generate the corresponding blocks.',
                        'ultimate-markdown')}
                    value={markdownText}
                    onChange={(value) => {

                        dispatch('core/editor').editPost({
                            meta: {
                                '_import_markdown_pro_submit_text_textarea': value,
                            },
                        });

                        // Used to rerender the component.
                        this.setState({
                            textareaValue: value,
                        });
                    }}
                />

                <Button
                    variant="secondary"
                    className="editor-post-trash is-destructive"
                    onClick={() => {

                        // Send ajax request.
                        const data = new FormData();
                        data.append('action', 'daextulma_submit_markdown');
                        data.append('security', window.DAEXTULMA_PARAMETERS.nonce);
                        data.append('markdowntext', markdownText);

                        fetch(window.DAEXTULMA_PARAMETERS.ajaxUrl, {
                            method: 'POST',
                            body: data,
                        }).then((response) => {

                            return response.json();

                        }).then((data) => {

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

                            // Set the textarea to an empty value.
                            dispatch('core/editor').editPost({
                                meta: {
                                    '_import_markdown_pro_submit_text_textarea': '',
                                },
                            });

                            // Used to rerender the component.
                            this.setState({
                                textareaValue: '',
                            });

                        });

                    }}
                >{__('Submit text', 'ultimate-markdown')}</Button>

            </PluginDocumentSettingPanel>
        );
    }
}