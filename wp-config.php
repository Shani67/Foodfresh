<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'geefashion' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'v T{4b(,o_L)jm0Em&Bb;=MK~cMW,V=;~pjtQ(i[>X/L@1c#2bXsy]_[61|7Jd0X' );
define( 'SECURE_AUTH_KEY',  'iZ;1lNX.fczM~v5_j`1lmW,pv{JHW_YkBvd2F_A<!t&#XEStJBv(BtA5%MPP1vhZ' );
define( 'LOGGED_IN_KEY',    'FFadn.HaO}CRQ!P0Ef *7lI?]s2BD.@&BF{&a&/g3oO,i4a*W8+rDYE#4N&[66!5' );
define( 'NONCE_KEY',        'VNJRB.}O,JOuQAMSduVqj?),0)dKjF]<{bN6CQ^TbC<?]#ac4_(`tA0QmVAk0fVZ' );
define( 'AUTH_SALT',        '8^0bcC5Hu**^FMG=,Xg]ai?8tz.5gZ#60_z&,K[-{0>xol/_6[Ni4%?Vf< XlBC[' );
define( 'SECURE_AUTH_SALT', 'A$XS6*9-276IZfQl!z+%8P]~<4v`?3U6R#=O8d~|oN+bq6v(;xhAnb{&TY,]uyIp' );
define( 'LOGGED_IN_SALT',   'TR1MwfDAJFjZOQv,2&17L<=-1xDoU_Wrbxta9^rmrrfr%1je?fK|[q.-YKs>X4NT' );
define( 'NONCE_SALT',       'eh*dR!{wC~8QtJ@&zE{!ZhAXQvnWB4}Eg{y|w+blo?CNb`,w4_2s{0*%#.,O$}S^' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
