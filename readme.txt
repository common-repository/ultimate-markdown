=== Ultimate Markdown - Markdown Editor, Importer, & Exporter ===
Contributors: DAEXT
Tags: markdown, markdown editor, import markdown, export markdown, front matter
Donate link: https://daext.com
Requires at least: 5.0
Tested up to: 6.5.5
Requires PHP: 5.3
Stable tag: 1.18
License: GPLv3

Generate block-based articles from a Markdown file, bulk import and export Markdown documents, create Markdown documents from an editor, and more.

== Description ==
Ultimate Markdown is a plugin for WordPress that allows you to create WordPress posts with the popular Markdown syntax.

Specifically, after installing the plugin, you will be able to:

* Create posts with perfectly formatted blocks from existing Markdown files or Markdown documents created with the plugin.
* Instantly generate blocks from Markdown text.
* Create and manage an unlimited number of Markdown documents in a dedicated plugin menu.
* Import Markdown file in WordPress.
* Create archives of Markdown files from the Markdown documents created with the plugin.

Please note that this plugin requires the use of the default [WordPress Blocks Editor](https://wordpress.org/support/article/blocks/). With third-party visual editors or with the [Classic Editor](https://wordpress.org/plugins/classic-editor/), you will not be able to use most of the plugin functionalities.

### Pro Version

We distribute the [Pro version](https://daext.com/ultimate-markdown/) of this plugin that includes more export options, REST API, additional Markdown parsers, document categories, and more.

### Additional post sidebar sections

The plugin adds the following sections to the post sidebar.

#### Import Markdown

This section allows you to generate the blocks of a post from an uploaded Markdown file.

#### Load Markdown

Use this feature to create the blocks of a post from a Markdown document previously created with the plugin.

#### Submit Markdown

With this section, you can instantly transform Markdown text to blocks.

### Dedicated plugin menus

#### Documents

This menu includes a Markdown editor with an HTML preview section. In addition, you will find functionalities to create, edit, duplicate or delete your Markdown documents.

#### Import

Import one or more Markdown files in the plugin with the upload form provided in this menu.

#### Export

With this menu, you can generate Markdown files from the Markdown documents stored in the plugin.

### Supported Markdown syntax

The conversion from Markdown text to HTML is performed with [Marked](https://github.com/markedjs/marked), a high-performance Markdown parser that supports documents written in the following [Markdown flavors](https://github.com/commonmark/commonmark-spec/wiki/Markdown-Flavors).

### Front Matter

The plugin supports Front Matter key-value pairs provided in the [YAML](https://yaml.org/) language. With this feature, you can configure specific post settings by providing their values at the beginning of the Markdown document.

Please see the [plugin documentation](https://daext.com/doc/ultimate-markdown/) for more information on the available Front Matter keys and practical examples.

### Credits

This plugin makes use of the following resources:

* [DOMPurify](https://github.com/cure53/DOMPurify) licensed under the [Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
* [Marked](https://github.com/markedjs/marked) licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
* [Composer](https://getcomposer.org/) licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
* [HTML To Markdown for PHP](https://github.com/thephpleague/html-to-markdown) licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php)
* [FrontYAML](https://github.com/mnapoli/FrontYAML) licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php)

== Installation ==
= Installation (Single Site) =

With this procedure you will be able to install the Ultimate Markdown plugin on your WordPress website:

1. Visit the **Plugins -> Add New** menu
2. Click on the **Upload Plugin** button and select the zip file you just downloaded
3. Click on **Install Now**
4. Click on **Activate Plugin**

= Installation (Multisite) =

This plugin supports both a **Network Activation** (the plugin will be activated on all the sites of your WordPress Network) and a **Single Site Activation** in a **WordPress Network** environment (your plugin will be activated on a single site of the network).

With this procedure you will be able to perform a **Network Activation**:

1. Visit the **Plugins -> Add New** menu
2. Click on the **Upload Plugin** button and select the zip file you just downloaded
3. Click on **Install Now**
4. Click on **Network Activate**

With this procedure you will be able to perform a **Single Site Activation** in a **WordPress Network** environment:

1. Visit the specific site of the **WordPress Network** where you want to install the plugin
2. Visit the **Plugins** menu
3. Click on the **Activate** button (just below the name of the plugin)

== Changelog ==

= 1.18 =

*June 26, 2024*

* wp_unslash() was added to the Documents menu before input sanitization.

= 1.17 =

*June 26, 2024*

* An alert message now prevents uploading more than the maximum number of files allowed with the max_file_uploads directive.

= 1.16 =

*June 25, 2024*

* Vendor packages updated.

= 1.15 =

*June 25, 2024*

* Major back-end UI update.

= 1.14 =

*April 7, 2024*

* Fixed a bug (started with WordPress version 6.5) that prevented the creation of the plugin database tables and the initialization of the plugin database options during the plugin activation.

= 1.13 =

*March 26, 2024*

* The phpcs "WordPress" ruleset has been applied to the plugin code.
* Nonce verification has been added to the Documents menu for create/update/delete/duplicate operations.
* Nonce verification has been added to the Import and Export menus.
* The Select2 library has been removed.
* Removed React warning in the block editor.

= 1.12 =

*November 8, 2023*

* Removed deprecation warnings.

= 1.11 =

*February 22, 2023*

* Fixed a bug causing incorrect parsing of Markdown tables in the context of the block editor.

= 1.10 =

*September 22, 2022*

* Fixed a bug causing JavaScript errors in the site-editor.php page.
* The "Content" textarea of the "Documents" menu now supports up to 1,000,000 characters.
* Front Matter is now supported and can be used to configure post settings.

= 1.09 =

*June 13, 2022*

* Fixed a bug causing JavaScript errors in the widgets.php page.
* The "Pro Version" menu has been added.
* A link to the Pro version has been added in the "Plugins" menu.

= 1.08 =

*November 24, 2021*

* Fixed a bug causing JavaScript errors in the post editor of custom post types that don't declare support for custom fields.
* Aria attributes added in the "Documents" menu.

= 1.07 =

*November 4, 2021*

* Improved the message displayed in the "Import" menu after a successful submission.
* Improved input sanitization.
* The file extensions supported in the upload process of the "Import" menu have been limited.

= 1.06 =

*November 3, 2021*

* Initial release.

== Screenshots ==
1. Import Markdown section in the post sidebar.
2. Load Markdown section in the post sidebar.
3. Submit Markdown section in the post sidebar.
4. A single document.
5. List of documents.
6. Tools menu.
7. Options menu.