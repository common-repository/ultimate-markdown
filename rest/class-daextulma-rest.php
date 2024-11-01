<?php
/**
 * Here the REST API endpoint of the plugin are registered.
 *
 * @package ultimate-markdown
 */

/**
 * This class should be used to work with the REST API.
 */
class Daextulma_Rest {

	/**
	 * The singleton instance of the class.
	 *
	 * @var null
	 */
	protected static $instance = null;

	/**
	 * An instance of the shared class.
	 *
	 * @var Daextulma_Shared|null
	 */
	private $shared = null;

	/**
	 * The object to return when the authentication fails.
	 *
	 * @var WP_REST_Response|null
	 */
	private $invalid_authentication_object = null;

	/**
	 * An instance of the Front Matter class.
	 *
	 * @var Daextulma_Front_Matter|null
	 */
	private $front_matter = null;

	/**
	 * Constructor.
	 */
	private function __construct() {

		// Assign an instance of the plugin info.
		$this->shared = Daextulma_Shared::get_instance();

		$this->invalid_authentication_object = new WP_REST_Response( 'Invalid authentication.', '403' );

		/*
		 * Add custom routes to the Rest API
		 */
		add_action( 'rest_api_init', array( $this, 'rest_api_register_route' ) );

		// Require and instantiate the class used to handle Front Matter.
		require_once $this->shared->get( 'dir' ) . 'admin/inc/class-daextulma-front-matter.php';
		$this->front_matter = new Daextulma_Front_Matter( $this->shared );
	}

	/**
	 * Create a singleton instance of the class.
	 *
	 * @return self|null
	 */
	public static function get_instance() {

		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Add custom routes to the Rest API.
	 *
	 * @return void
	 */
	public function rest_api_register_route() {

		// Add the POST 'ultimate-markdown/v1/read-options/' endpoint to the Rest API.
		register_rest_route(
			'ultimate-markdown/v1',
			'/read-options/',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'rest_api_ultimate_markdown_read_options_callback' ),
				'permission_callback' => array( $this, 'rest_api_ultimate_markdown_read_options_callback_permission_check' ),
			)
		);

		// Add the POST 'ultimate-markdown/v1/options/' endpoint to the Rest API.
		register_rest_route(
			'ultimate-markdown/v1',
			'/options',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'rest_api_ultimate_markdown_update_options_callback' ),
				'permission_callback' => array( $this, 'rest_api_ultimate_markdown_update_options_callback_permission_check' ),
			)
		);

	}

	/**
	 * Callback for the GET 'ultimate-markdown/v1/options' endpoint of the Rest API.
	 *
	 *   This method is in the following contexts:
	 *
	 *  - To retrieve the plugin options in the "Options" menu.
	 *
	 * @return WP_Error|WP_REST_Response
	 */
	public function rest_api_ultimate_markdown_read_options_callback() {

		// Generate the response.
		$response = array();
		foreach ( $this->shared->get( 'options' ) as $key => $value ) {
			$response[ $key ] = get_option( $key );
		}

		// Prepare the response.
		$response = new WP_REST_Response( $response );

		return $response;
	}

	/**
	 * Check the user capability.
	 *
	 * @return true|WP_Error
	 */
	public function rest_api_ultimate_markdown_read_options_callback_permission_check() {

		if ( ! current_user_can( 'manage_options' ) ) {
			return new WP_Error(
				'rest_read_error',
				'Sorry, you are not allowed to read the Ultimate Markdown options.',
				array( 'status' => 403 )
			);
		}

		return true;
	}

	/**
	 * Callback for the POST 'ultimate-markdown/v1/options' endpoint of the Rest API.
	 *
	 * This method is in the following contexts:
	 *
	 *  - To update the plugin options in the "Options" menu.
	 *
	 * @param object $request The request data.
	 *
	 * @return WP_REST_Response
	 */
	public function rest_api_ultimate_markdown_update_options_callback( $request ) {

		// get and sanitize data --------------------------------------------------------------------------------------.

		$options = array();

		// Tab - Advanced ---------------------------------------------------------------------------------------------.

		// Section - Capabilities -------------------------------------------------------------------------------------.
		$options['daextulma_documents_menu_required_capability']  = $request->get_param( 'daextulma_documents_menu_required_capability' ) !== null ? sanitize_key( $request->get_param( 'daextulma_documents_menu_required_capability' ) ) : null;
		$options['daextulma_tools_menu_required_capability']      = $request->get_param( 'daextulma_tools_menu_required_capability' ) !== null ? sanitize_key( $request->get_param( 'daextulma_tools_menu_required_capability' ) ) : null;

		foreach ( $options as $key => $option ) {
			if ( null !== $option ) {
				update_option( $key, $option );
			}
		}

		return new WP_REST_Response( 'Data successfully added.', '200' );
	}

	/**
	 * Check the user capability.
	 *
	 * @return true|WP_Error
	 */
	public function rest_api_ultimate_markdown_update_options_callback_permission_check() {

		if ( ! current_user_can( 'manage_options' ) ) {
			return new WP_Error(
				'rest_update_error',
				'Sorry, you are not allowed to update the Ultimate Markdown options.',
				array( 'status' => 403 )
			);
		}

		return true;
	}

}
