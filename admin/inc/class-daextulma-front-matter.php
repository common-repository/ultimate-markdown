<?php
/**
 * This class handles Front Matter.
 *
 * @package ultimate-markdown
 */

/**
 * This class handles Front Matter.
 */
class Daextulma_Front_Matter {

	/**
	 * An instance of the shared class.
	 *
	 * @var Daextulma_Shared
	 */
	private $shared = null;

	/**
	 * The constructor.
	 *
	 * @param Daextulma_Shared $shared An instance of the shared class.
	 */
	public function __construct( $shared ) {

		// Assign an instance of the plugin info.
		$this->shared = $shared;
	}

	/**
	 * Get the YAML data available in the provided string.
	 *
	 * @param string $str The string that contains the YAML data.
	 *
	 * @return array
	 */
	public function get( $str ) {

		// Get an array with the Front Matter data by using the FrontYAML library.
		require_once $this->shared->get( 'dir' ) . 'globalize-front-yaml.php';
		global $daextulma_front_yaml_parser;

		try {
			$document = $daextulma_front_yaml_parser->parse( $str );
			$data     = $document->getYAML();
		} catch ( Exception $e ) {
			$data = array();
		}

		// Sanitize and prepare the YAML data.
		$data = $this->prepare_fields( $data );

		return $data;
	}

	/**
	 * Sanitize and validate the data provided by the user as Front Matter fields.
	 *
	 * @param array $yaml_data An array with the YAML data.
	 *
	 * @return array
	 */
	private function prepare_fields( $yaml_data ) {

		$sanitized_data = array();

		// Sanitization -----------------------------------------------------------------------------------------------.

		// Title.
		$sanitized_data['title'] = isset( $yaml_data['title'] ) ? sanitize_text_field( $yaml_data['title'] ) : null;

		// Excerpt.
		$sanitized_data['excerpt'] = isset( $yaml_data['excerpt'] ) ? sanitize_text_field( $yaml_data['excerpt'] ) : null;

		// Categories.
		$sanitized_data['categories'] = isset( $yaml_data['categories'] ) ? array_map( 'sanitize_text_field', $yaml_data['categories'] ) : null;

		// Tags.
		$sanitized_data['tags'] = isset( $yaml_data['tags'] ) ? array_map( 'sanitize_text_field', $yaml_data['tags'] ) : null;

		// Author.
		$sanitized_data['author'] = isset( $yaml_data['author'] ) ? sanitize_text_field( $yaml_data['author'] ) : null;

		// Date.
		$sanitized_data['date'] = isset( $yaml_data['date'] ) ? sanitize_text_field( $yaml_data['date'] ) : null;

		// Status.
		$sanitized_data['status'] = isset( $yaml_data['status'] ) ? sanitize_key( $yaml_data['status'] ) : null;

		// Validation -------------------------------------------------------------------------------------------------.

		$validated_data = array();

		// Title.
		if ( ! is_null( $sanitized_data['title'] ) && strlen( trim( $sanitized_data['title'] ) ) > 0 ) {
			$validated_data['title'] = $sanitized_data['title'];
		} else {
			$validated_data['title'] = null;
		}

		// Excerpt.
		if ( ! is_null( $sanitized_data['excerpt'] ) && strlen( trim( $sanitized_data['excerpt'] ) ) > 0 ) {
			$validated_data['excerpt'] = $sanitized_data['excerpt'];
		} else {
			$validated_data['excerpt'] = null;
		}

		// Categories.
		$validated_data['categories'] = $this->prepare_categories( $sanitized_data['categories'] );

		// Tags.
		$validated_data['tags'] = $this->prepare_tags( $sanitized_data['tags'] );

		// Author.
		$validated_data['author'] = $this->prepare_author( $sanitized_data['author'] );

		// Date.
		$validated_data['date'] = $this->prepare_date( $sanitized_data['date'] );

		// Status.
		$validated_data['status'] = $this->prepare_status( $sanitized_data['status'] );

		return $validated_data;
	}

	/**
	 * Generates an array with existing category IDs from an array that includes:
	 *
	 * - Non verified category names
	 * - Non verified category IDs
	 *
	 * @param string $raw_categories A string with category names or IDs.
	 *
	 * @return array An array with existing category IDs
	 */
	private function prepare_categories( $raw_categories ) {

		if ( null === $raw_categories ) {
			return null;
		}

		$categories = array();
		foreach ( $raw_categories as $category ) {

			/**
			 * If the provided value is numeric it is a category ID. Otherwise, it is a category name.
			 */
			if ( is_numeric( $category ) ) {

				// If a category with the provided ID exists use it.
				if ( term_exists( intval( $category, 10 ), 'category' ) ) {
					$categories[] = intval( $category, 10 );
				}
			} else {

				// Find the categories IDs from category name.
				$found_category_id = get_cat_ID( $category );
				if ( 0 !== $found_category_id ) {
					$categories[] = $found_category_id;
				}
			}
		}

		if ( count( $categories ) > 0 ) {
			return $categories;
		} else {
			return null;
		}
	}

	/**
	 * Generates an array with existing category IDs from an array that includes:
	 *
	 * - Non verified category names
	 * - Non verified category IDs
	 *
	 * @param string $raw_tags A string with tag names or IDs.
	 *
	 * @return array An array with existing category IDs
	 */
	private function prepare_tags( $raw_tags ) {

		if ( null === $raw_tags ) {
			return null;
		}

		$tags = array();
		foreach ( $raw_tags as $tag ) {

			if ( intval( $tag, 10 ) ) {

				// If a tag with the provided ID exists use it.
				if ( term_exists( $tag, 'post_tag' ) ) {
					$tags[] = $tag;
				}
			} else {

				// Find the tags IDs from tag name.
				$term_obj = get_term_by( 'name', $tag, 'post_tag' );

				if ( false !== $term_obj ) {
					$tags[] = $term_obj->term_id;
				}
			}
		}

		if ( count( $tags ) > 0 ) {
			return $tags;
		} else {
			return null;
		}
	}

	/**
	 * If a valid user ID is provided returned the user ID. Otherwise, retrieve the user from the user login name.
	 *
	 * @param string $value A user ID.
	 *
	 * @return int
	 */
	private function prepare_author( $value ) {

		if ( null === $value ) {
			return null;
		}

		// If the user is provided with a valid ID return its ID.
		if ( $this->shared->user_id_exists( $value ) ) {

			return $value;

		} else {

			// Get the ID of the user from the user login name.
			$user_obj = get_user_by( 'login', $value );

			if ( false !== $user_obj ) {

				return $user_obj->ID;

			}
		}

		return null;
	}


	/**
	 * If the date is valid returns it, otherwise returns null.
	 *
	 * @param string $date A date in 'Y-m-d h:i:s' format.
	 *
	 * @return string|null
	 */
	private function prepare_date( $date ) {

		if ( null === $date ) {
			return null;
		}

		/**
		 * Note that the FrontYaml convert the date available in the string in the 'Y-m-d h:i:s' format to a unix date.
		 * As a consequence the date here is reconverted to the 'Y-m-d h:i:s' format with the PHP date() function.
		 */
		$date = gmdate( 'Y-m-d h:i:s', $date );

		// Validate the date with a regex.
		$date_regex = '/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s([0-6][0-9]|[0-9]):([0-6][0-9]|[0-9]):([0-6][0-9]|[0-9])$/';
		if ( preg_match( $date_regex, $date ) ) {
			$date = $date;
		} else {
			$date = null;
		}

		return $date;
	}

	/**
	 * If the provided status is valid returns the status, otherwise returns false.
	 *
	 * Note that only six of the height default WordPress statuses are valid.
	 * See: https://wordpress.org/support/article/post-status/
	 *
	 * @param string $status The post status.
	 *
	 * @return mixed|null
	 */
	private function prepare_status( $status ) {

		$valid_statuses = array( 'publish', 'future', 'draft', 'pending', 'private', 'trash' );
		if ( in_array( $status, $valid_statuses, true ) ) {
			return $status;
		} else {
			return null;
		}
	}
}
