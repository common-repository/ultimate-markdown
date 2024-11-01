/**
 * This file is used to store utility functions used in the block editor.
 *
 * @package ultimate-markdown
 */

/**
 * Add a category and refresh the panel.
 *
 * See: https://stackoverflow.com/questions/69983604/changing-a-posts-tag-category-from-a-wordpress-gutenberg-sidebar-plugin/70029499#70029499
 *
 * @param category
 * @constructor
 */
export function AddCategory(category) {

    const {dispatch, select} = wp.data;

    // Get Current Selected Categories.
    let categories = select('core/editor').getEditedPostAttribute('categories');

    // Get State of Category Panel.
    let is_category_panel_open = select('core/edit-post').isEditorPanelOpened('taxonomy-panel-category');

    // Verify new category isn't already selected.
    if (!categories.includes(category)) {

        // Add new tag to existing list.
        categories.push(category);

        // Update Post with new tags.
        dispatch('core/editor').editPost({'categories': categories});

        // Verify if the category panel is open.
        if (is_category_panel_open) {

            // Close and re-open the category panel to reload data / refresh the UI.
            dispatch('core/edit-post').toggleEditorPanelOpened('taxonomy-panel-category');
            dispatch('core/edit-post').toggleEditorPanelOpened('taxonomy-panel-category');
        }
    }
}

/**
 * Add the tag and refresh the panel.
 *
 * See: https://stackoverflow.com/questions/69983604/changing-a-posts-tag-category-from-a-wordpress-gutenberg-sidebar-plugin/70029499#70029499
 *
 * @param tag
 * @constructor
 */
export function AddTag(tag) {

    const {dispatch, select} = wp.data;

    // Get Current Selected Tags.
    let tags = select('core/editor').getEditedPostAttribute('tags');

    // Get State of Tag Panel.
    let is_tag_panel_open = select('core/edit-post').isEditorPanelOpened('taxonomy-panel-tags');

    // Verify new tag isn't already selected.
    if (!tags.includes(tag)) {

        // Add new tag to existing list.
        tags.push(tag);

        // Update Post with new tags.
        dispatch('core/editor').editPost({'tags': tags});

        // Verify if the tag panel is open.
        if (is_tag_panel_open) {

            // Close and re-open the tag panel to reload data / refresh the UI.
            dispatch('core/edit-post').toggleEditorPanelOpened('taxonomy-panel-tags');
            dispatch('core/edit-post').toggleEditorPanelOpened('taxonomy-panel-tags');
        }
    }

}

/**
 * Updates the editor fields based on the provided data.
 *
 * @param blocks The blocks that should be added in the block editor
 * @param data The data used to update various fields of the editor
 */
export function updateFields(blocks, data) {

    const {dispatch, select} = wp.data;

    // Insert the blocks in the editor.
    wp.data.dispatch('core/block-editor').insertBlocks(blocks);

    // Update the post title.
    if (data['title'] !== null) {
        wp.data.dispatch('core/editor').editPost({title: data['title']});
    }

    // Update the excerpt.
    if (data['excerpt'] !== null) {
        wp.data.dispatch('core/editor').editPost({excerpt: data['excerpt']});
    }

    // Update the categories.
    if (data['categories'] !== null) {
        data['categories'].forEach((category) => {
            AddCategory(category);
        });
    }

    // Update the tags.
    if (data['tags'] !== null) {
        data['tags'].forEach((tag) => {
            AddTag(tag);
        });
    }

    // Update the author.
    if (data['author'] !== null) {
        wp.data.dispatch('core/editor').editPost({author: data['author']});
    }

    // Update the date.
    if (data['date'] !== null) {
        wp.data.dispatch('core/editor').editPost({date: data['date']});
    }

    // Update the status.
    if (data['status'] !== null) {
        wp.data.dispatch('core/editor').editPost({status: data['status']});
    }

}

/**
 * Download a file from the provided string.
 *
 * @param content
 * @param fileNameExtension
 */
export const downloadFileFromString = (content, fileNameExtension, postId) => {

    const blob = content;

    // Create a temporary URL to the blob.
    const url = window.URL.createObjectURL(new Blob([blob]));

    // Create a link element.
    const link = document.createElement('a');
    link.href = url;
    const fileName = 'post-' + postId + '.' + fileNameExtension;
    link.setAttribute('download', fileName); // Specify the filename

    // Append the link to the body.
    document.body.appendChild(link);

    // Trigger the click event on the link.
    link.click();

    // Cleanup.
    link.parentNode.removeChild(link);

}