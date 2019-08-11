<?php
/*
Plugin Name: WP Sites Show Admin Info
Plugin URI: https://github.com/thebrentc/wp-sites-show-admin-info
Description: Wordpress plugin to show administrator detail (email address) on network sites admin screen
Version: 0.1
Author: thebrentc@gmail.com
Author URI: https://network23.org/theb/
License: GPL2
*/

if (!class_exists('WP_Sites_Show_Admin_Info')) {
	
	class WP_Sites_Show_Admin_Info {
		
		// add column header
		public static function wp_sites_show_admin_info_columns($users_columns) {
			$users_columns['admin_email'] = __("Admin email");
			return $users_columns;
		}
		
		// add column detail
		public static function wp_sites_show_admin_info_columns_detail($column_name, $blog_id ) {
			if ('admin_email' === $column_name ) {
				echo get_blog_option($blog_id, 'admin_email', '');
			}			
		}		

		public static function init() {
			if(is_multisite()) {
				add_filter('wpmu_blogs_columns', array(get_called_class(), 'wp_sites_show_admin_info_columns'));
				add_action( 'manage_sites_custom_column', array(get_called_class(), 'wp_sites_show_admin_info_columns_detail' ), 10, 2 );
				add_action( 'manage_blogs_custom_column', array(get_called_class(), 'wp_sites_show_admin_info_columns_detail' ), 10, 2 );
			}
		}
	}
}

if (class_exists('WP_Sites_Show_Admin_Info')) {
	WP_Sites_Show_Admin_Info::init();
}
